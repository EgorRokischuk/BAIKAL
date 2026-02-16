import { useCallback, useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { Box, Typography } from '@mui/material';
import { MapContainer, useMap, useMapEvents } from 'react-leaflet';
import dayjs, { type Dayjs } from 'dayjs';
import { useAppSelector } from '@/store/hooks';
import {
  selectCompareState,
  selectIsCompareEnabled,
  selectMapZoom,
  selectTileLink,
  selectTileOptions,
} from '@/store/slices/mapSelectors';
import { MAP_CONFIG } from '../data/mapConfig';
import { TilesLayer } from './controls/TilesLayer';
import { InterestObjectsLayer } from './controls/InterestObjectsLayer';
import { GroundDataMarkers } from './controls/GroundDataMarkers';
import { MapLegendOverlay } from './controls/MapLegendOverlay';
import { ZoomButtons } from './controls/ZoomButtons';
import { CoordinatesOverlay } from './controls/CoordinatesOverlay';
import { GeeSelectionLayer } from './controls/GeeSelectionLayer';
import { GeeOverlay } from './controls/GeeOverlay';
import { RasterPointPopupLayer } from './controls/RasterPointPopupLayer';
import styles from './CompareMapCanvas.module.scss';

const VIEW_EPSILON = 0.00001;

const areViewsEqual = (source: LeafletMap, target: LeafletMap) => {
  const sourceCenter = source.getCenter();
  const targetCenter = target.getCenter();

  const sameCenter =
    Math.abs(sourceCenter.lat - targetCenter.lat) < VIEW_EPSILON &&
    Math.abs(sourceCenter.lng - targetCenter.lng) < VIEW_EPSILON;

  return sameCenter && source.getZoom() === target.getZoom();
};

interface CompareSyncControllerProps {
  getPeerMap: () => LeafletMap | null;
  syncLockRef: MutableRefObject<boolean>;
}

const CompareSyncController = ({ getPeerMap, syncLockRef }: CompareSyncControllerProps) => {
  const map = useMap();

  const syncPeer = useCallback(() => {
    if (syncLockRef.current) {
      return;
    }

    const peer = getPeerMap();
    if (!peer || areViewsEqual(map, peer)) {
      return;
    }

    syncLockRef.current = true;
    peer.setView(map.getCenter(), map.getZoom(), { animate: false });

    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(() => {
        syncLockRef.current = false;
      });
      return;
    }

    syncLockRef.current = false;
  }, [getPeerMap, map, syncLockRef]);

  useMapEvents({
    move: syncPeer,
    zoom: syncPeer,
  });

  return null;
};

interface MapInstanceBridgeProps {
  onMapReady: (map: LeafletMap) => void;
}

const MapInstanceBridge = ({ onMapReady }: MapInstanceBridgeProps) => {
  const map = useMap();

  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);

  return null;
};

interface TileRefreshControllerProps {
  refreshKey?: string;
  enabled?: boolean;
}

const TileRefreshController = ({ refreshKey, enabled = true }: TileRefreshControllerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!enabled || !refreshKey) return;

    const refresh = () => {
      map.invalidateSize();
    };

    refresh();

    if (typeof window === 'undefined') {
      return;
    }

    const timerId = window.setTimeout(refresh, 90);
    return () => window.clearTimeout(timerId);
  }, [enabled, map, refreshKey]);

  return null;
};

interface InteractionLockControllerProps {
  locked: boolean;
}

const InteractionLockController = ({ locked }: InteractionLockControllerProps) => {
  const map = useMap();

  useEffect(() => {
    const handlers = [
      map.dragging,
      map.scrollWheelZoom,
      map.doubleClickZoom,
      map.touchZoom,
      map.boxZoom,
      map.keyboard,
    ];

    const mapWithTap = map as LeafletMap & {
      tap?: {
        enable: () => void;
        disable: () => void;
      };
    };

    if (locked) {
      map.stop();
      handlers.forEach((handler) => handler.disable());
      mapWithTap.tap?.disable();
      return;
    }

    handlers.forEach((handler) => handler.enable());
    mapWithTap.tap?.enable();
  }, [locked, map]);

  return null;
};

interface CompareMapPaneProps {
  title: string;
  overlayTileLink: string;
  zoom: number;
  center: [number, number];
  onMapReady: (map: LeafletMap) => void;
  getPeerMap: () => LeafletMap | null;
  syncLockRef: MutableRefObject<boolean>;
}

const CompareMapPane = ({
  title,
  overlayTileLink,
  zoom,
  center,
  onMapReady,
  getPeerMap,
  syncLockRef,
}: CompareMapPaneProps) => {
  return (
    <div className={styles.comparePane}>
      <Box className={styles.compareTitle}>
        <Typography variant="caption">{title}</Typography>
      </Box>

      <MapContainer
        zoom={zoom}
        center={center}
        zoomControl={false}
        doubleClickZoom={false}
        minZoom={MAP_CONFIG.minZoom}
        maxBounds={MAP_CONFIG.maxBounds}
      >
        <TilesLayer overlayTileLink={overlayTileLink} />
        <TileRefreshController refreshKey={overlayTileLink} />
        <InterestObjectsLayer />
        <ZoomButtons />
        <MapInstanceBridge onMapReady={onMapReady} />
        <CompareSyncController getPeerMap={getPeerMap} syncLockRef={syncLockRef} />
      </MapContainer>
    </div>
  );
};

const formatCompareLabel = (prefix: string, date: Dayjs | null, type: string) => {
  if (!date) {
    return prefix;
  }

  if (type === 'monthlyAvgManyYears' || type === 'chlorophyll') {
    return `${prefix}: ${dayjs(date).format('MM')}`;
  }

  if (type === 'monthlyAvg') {
    return `${prefix}: ${dayjs(date).format('MM.YYYY')}`;
  }

  return `${prefix}: ${dayjs(date).format('DD.MM.YYYY')}`;
};

interface CompareMapCanvasProps {
  onSingleMapReady?: (map: LeafletMap | null) => void;
}

const CompareMapCanvas = ({ onSingleMapReady }: CompareMapCanvasProps) => {
  const zoom = useAppSelector(selectMapZoom);
  const compare = useAppSelector(selectCompareState);
  const tileOptions = useAppSelector(selectTileOptions);

  const leftMapRef = useRef<LeafletMap | null>(null);
  const rightMapRef = useRef<LeafletMap | null>(null);
  const syncLockRef = useRef(false);

  const center: [number, number] = [MAP_CONFIG.center.lat, MAP_CONFIG.center.lng];

  const syncToSource = useCallback((source: LeafletMap | null, target: LeafletMap | null) => {
    if (!source || !target || areViewsEqual(source, target)) {
      return;
    }

    target.setView(source.getCenter(), source.getZoom(), { animate: false });
  }, []);

  const onLeftReady = useCallback(
    (map: LeafletMap) => {
      leftMapRef.current = map;
      syncToSource(rightMapRef.current, map);
    },
    [syncToSource],
  );

  const onRightReady = useCallback(
    (map: LeafletMap) => {
      rightMapRef.current = map;
      syncToSource(leftMapRef.current, map);
    },
    [syncToSource],
  );

  const getLeftMap = useCallback(() => leftMapRef.current, []);
  const getRightMap = useCallback(() => rightMapRef.current, []);

  useEffect(() => {
    onSingleMapReady?.(null);

    return () => {
      leftMapRef.current = null;
      rightMapRef.current = null;
      onSingleMapReady?.(null);
    };
  }, [onSingleMapReady]);

  const leftTitle = formatCompareLabel('Дата A', compare.leftDate, tileOptions.type);
  const rightTitle = formatCompareLabel('Дата B', compare.rightDate, tileOptions.type);

  return (
    <div className={styles.compareWrap}>
      <CompareMapPane
        title={leftTitle}
        overlayTileLink={compare.leftTileLink}
        zoom={zoom}
        center={center}
        onMapReady={onLeftReady}
        getPeerMap={getRightMap}
        syncLockRef={syncLockRef}
      />

      <CompareMapPane
        title={rightTitle}
        overlayTileLink={compare.rightTileLink}
        zoom={zoom}
        center={center}
        onMapReady={onRightReady}
        getPeerMap={getLeftMap}
        syncLockRef={syncLockRef}
      />
    </div>
  );
};

interface SingleMapCanvasProps {
  isInteractionLocked: boolean;
  onMapReady: (map: LeafletMap) => void;
}

const SingleMapCanvas = ({ isInteractionLocked, onMapReady }: SingleMapCanvasProps) => {
  const zoom = useAppSelector(selectMapZoom);
  const tileLink = useAppSelector(selectTileLink);

  return (
    <MapContainer
      zoom={zoom}
      zoomControl={false}
      doubleClickZoom={false}
      center={MAP_CONFIG.center}
      minZoom={MAP_CONFIG.minZoom}
      maxBounds={MAP_CONFIG.maxBounds}
    >
      <MapInstanceBridge onMapReady={onMapReady} />
      <InteractionLockController locked={isInteractionLocked} />

      <MapLegendOverlay />
      <TilesLayer />
      <TileRefreshController refreshKey={tileLink} enabled={!isInteractionLocked} />
      <InterestObjectsLayer />
      <GroundDataMarkers />

      <ZoomButtons disabled={isInteractionLocked} />
      <CoordinatesOverlay />
      <RasterPointPopupLayer />

      <GeeSelectionLayer />
      <GeeOverlay />
    </MapContainer>
  );
};

interface MapCanvasProps {
  isInteractionLocked?: boolean;
  onSingleMapReady?: (map: LeafletMap | null) => void;
}

export const MapCanvas = ({ isInteractionLocked = false, onSingleMapReady }: MapCanvasProps) => {
  const isCompareEnabled = useAppSelector(selectIsCompareEnabled);

  const handleSingleMapReady = useCallback(
    (map: LeafletMap) => {
      onSingleMapReady?.(map);
    },
    [onSingleMapReady],
  );

  if (isCompareEnabled) {
    return <CompareMapCanvas onSingleMapReady={onSingleMapReady} />;
  }

  return <SingleMapCanvas isInteractionLocked={isInteractionLocked} onMapReady={handleSingleMapReady} />;
};
