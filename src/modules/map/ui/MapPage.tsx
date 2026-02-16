import { useCallback, useRef, useState } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { Button, IconButton, Paper, Stack, Tooltip } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { env } from '@/shared/config/env';
import { MAP_CONFIG } from '../data/mapConfig';
import { MapCanvas } from './MapCanvas';
import { MapPanel, type TimelineOverlayControls, type TimelineOverlayState } from './panels/MapPanel';
import styles from './MapPage.module.scss';

const TIMELINE_RESET_ZOOM = 7;

const INITIAL_TIMELINE_STATE: TimelineOverlayState = {
  active: false,
  isPreparing: false,
  isRunning: false,
  isPaused: false,
  preparedCount: 0,
  totalCount: 0,
  estimatedSecondsRemaining: null,
  currentFrameLabel: '',
};

const formatRemainingTime = (seconds: number | null) => {
  if (seconds === null) return '...';
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const restSeconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(restSeconds).padStart(2, '0')}`;
};

const waitForNextPaint = async () => {
  if (typeof window === 'undefined') {
    return;
  }

  await new Promise<void>((resolve) => {
    if (typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(() => resolve());
      return;
    }

    window.setTimeout(() => resolve(), 16);
  });
};

const resolveTileUrl = (templatePath: string, z: number, x: number, y: number) => {
  const urlTemplate = `${env.tileApiUrl}${templatePath}`;

  return urlTemplate
    .replace(/\{z\}/gi, String(z))
    .replace(/\{x\}/gi, String(x))
    .replace(/\{y\}/gi, String(y))
    .replace(/%7Bz%7D/gi, String(z))
    .replace(/%7Bx%7D/gi, String(x))
    .replace(/%7By%7D/gi, String(y));
};

const buildVisibleTileUrls = (map: LeafletMap, templatePath: string) => {
  const zoom = Math.round(map.getZoom());
  const bounds = map.getPixelBounds();
  if (!bounds.min || !bounds.max) {
    return [];
  }
  const tileSize = 256;

  const minX = Math.floor(bounds.min.x / tileSize);
  const maxX = Math.floor(bounds.max.x / tileSize);
  const minY = Math.floor(bounds.min.y / tileSize);
  const maxY = Math.floor(bounds.max.y / tileSize);

  const worldSize = 2 ** zoom;
  const urls: string[] = [];

  for (let x = minX; x <= maxX; x += 1) {
    for (let y = minY; y <= maxY; y += 1) {
      if (y < 0 || y >= worldSize) {
        continue;
      }

      const wrappedX = ((x % worldSize) + worldSize) % worldSize;
      urls.push(resolveTileUrl(templatePath, zoom, wrappedX, y));
    }
  }

  return urls;
};

const preloadTileImage = (url: string) =>
  new Promise<void>((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    const image = new Image();
    image.loading = 'eager';
    image.decoding = 'async';
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = url;
  });

const preloadTilesWithLimit = async (urls: string[], concurrency = 10) => {
  if (!urls.length) return;

  let cursor = 0;
  const workers = Array.from({ length: Math.max(1, Math.min(concurrency, urls.length)) }, async () => {
    while (cursor < urls.length) {
      const current = urls[cursor];
      cursor += 1;
      await preloadTileImage(current);
    }
  });

  await Promise.all(workers);
};

export const MapPage = () => {
  const [panelOpened, setPanelOpened] = useState(true);
  const [manualMapLock, setManualMapLock] = useState(false);
  const [timelineState, setTimelineState] = useState<TimelineOverlayState>(INITIAL_TIMELINE_STATE);

  const timelineControlsRef = useRef<TimelineOverlayControls | null>(null);
  const singleMapRef = useRef<LeafletMap | null>(null);

  const isTimelineActive = timelineState.active;
  const isMapInteractionLocked = manualMapLock || timelineState.isPreparing || timelineState.isRunning;
  const isPanelVisible = panelOpened && !isTimelineActive;

  const handleSingleMapReady = useCallback((map: LeafletMap | null) => {
    singleMapRef.current = map;
  }, []);

  const handleTimelinePrepare = useCallback(async () => {
    setPanelOpened(false);
    setManualMapLock(true);

    const map = singleMapRef.current;
    if (!map) {
      return;
    }

    map.stop();
    map.setView([MAP_CONFIG.center.lat, MAP_CONFIG.center.lng], TIMELINE_RESET_ZOOM, { animate: false });
    map.invalidateSize();

    await waitForNextPaint();
  }, []);

  const recenterMapForTimeline = useCallback(() => {
    const map = singleMapRef.current;
    if (!map) {
      return;
    }

    map.stop();
    map.setView([MAP_CONFIG.center.lat, MAP_CONFIG.center.lng], TIMELINE_RESET_ZOOM, { animate: false });
    map.invalidateSize();
  }, []);

  const handleTimelineWarmup = useCallback(async (frameLinks: string[]) => {
    const map = singleMapRef.current;
    if (!map || !frameLinks.length || typeof window === 'undefined') {
      return;
    }

    const urls = new Set<string>();

    frameLinks.forEach((link) => {
      buildVisibleTileUrls(map, link).forEach((url) => urls.add(url));
    });

    await preloadTilesWithLimit(Array.from(urls));
  }, []);

  const handleTimelineControlsChange = useCallback((controls: TimelineOverlayControls | null) => {
    timelineControlsRef.current = controls;
  }, []);

  const handleTimelineFinish = useCallback(() => {
    setManualMapLock(false);
    setPanelOpened(true);
  }, []);

  const handleTimelineStateChange = useCallback((next: TimelineOverlayState) => {
    setTimelineState(next);

    if (!next.isPreparing) {
      setManualMapLock(false);
    }
  }, []);

  const timelineDateLabel = timelineState.currentFrameLabel
    ? `Дата: ${timelineState.currentFrameLabel}`
    : 'Дата: -';

  const handleTimelinePlaybackToggle = useCallback(() => {
    if (timelineState.isPreparing) {
      return;
    }

    if (timelineState.isPaused && !timelineState.isRunning) {
      recenterMapForTimeline();
    }

    timelineControlsRef.current?.togglePlayback();
  }, [recenterMapForTimeline, timelineState.isPaused, timelineState.isPreparing, timelineState.isRunning]);

  const handleTimelineStepBackward = useCallback(() => {
    if (timelineState.isPreparing || timelineState.isRunning || !timelineState.isPaused) {
      return;
    }

    recenterMapForTimeline();
    timelineControlsRef.current?.stepBackward();
  }, [recenterMapForTimeline, timelineState.isPaused, timelineState.isPreparing, timelineState.isRunning]);

  const handleTimelineStepForward = useCallback(() => {
    if (timelineState.isPreparing || timelineState.isRunning || !timelineState.isPaused) {
      return;
    }

    recenterMapForTimeline();
    timelineControlsRef.current?.stepForward();
  }, [recenterMapForTimeline, timelineState.isPaused, timelineState.isPreparing, timelineState.isRunning]);

  return (
    <div className={styles.page}>
      <Paper className={styles.mapCard}>
        <MapCanvas isInteractionLocked={isMapInteractionLocked} onSingleMapReady={handleSingleMapReady} />
      </Paper>

      <Paper
        className={`${styles.panelCard} ${isPanelVisible ? styles.panelOpened : styles.panelClosed} ${
          isTimelineActive ? styles.panelForceHidden : ''
        }`}
      >
        <MapPanel
          onRequestHidePanel={() => setPanelOpened(false)}
          onTimelinePrepare={handleTimelinePrepare}
          onTimelineWarmup={handleTimelineWarmup}
          onTimelineStateChange={handleTimelineStateChange}
          onTimelineControlsChange={handleTimelineControlsChange}
          onTimelineFinished={handleTimelineFinish}
        />
      </Paper>

      {isTimelineActive && (
        <div className={styles.timelineOverlay}>
          <div className={styles.timelineDate}>{timelineDateLabel}</div>

          {timelineState.isPreparing && timelineState.totalCount > 0 && (
            <div className={styles.timelineProgress}>
              {`Подготовка кадров: ${timelineState.preparedCount}/${timelineState.totalCount} · осталось ~${formatRemainingTime(timelineState.estimatedSecondsRemaining)}`}
            </div>
          )}

          <Stack direction="row" spacing={0.8} className={styles.timelineActions}>
            {timelineState.isPaused && !timelineState.isPreparing && (
              <>
                <Button
                  size="small"
                  variant="outlined"
                  className={styles.timelineStep}
                  onClick={handleTimelineStepBackward}
                >
                  Назад
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  className={styles.timelineStep}
                  onClick={handleTimelineStepForward}
                >
                  Вперед
                </Button>
              </>
            )}

            <Button
              size="small"
              variant="contained"
              className={styles.timelinePrimary}
              onClick={handleTimelinePlaybackToggle}
              disabled={timelineState.isPreparing}
            >
              {timelineState.isRunning ? 'Остановить' : 'Продолжить'}
            </Button>

            <Button
              size="small"
              variant="outlined"
              className={styles.timelineFinish}
              onClick={() => timelineControlsRef.current?.finish()}
            >
              Завершить
            </Button>
          </Stack>
        </div>
      )}

      <div className={styles.mapSignature}>© 2026 ФИЦ ИВТ. Все права защищены.</div>

      {!isTimelineActive && (
        <Tooltip title={isPanelVisible ? 'Скрыть панель данных' : 'Показать панель данных'}>
          <IconButton
            className={`${styles.toggleButton} ${isPanelVisible ? styles.toggleOpened : styles.toggleClosed}`}
            onClick={() => {
              setPanelOpened((prev) => !prev);
            }}
          >
            {isPanelVisible ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};
