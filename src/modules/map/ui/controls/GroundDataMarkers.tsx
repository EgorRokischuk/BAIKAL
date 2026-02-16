import dayjs from 'dayjs';
import L from 'leaflet';
import { useEffect, useMemo, useRef } from 'react';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Marker, Popup } from 'react-leaflet';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { appActions } from '@/store/slices/appSlice';
import {
  selectGroundDataOptions,
  selectIsPointsVisible,
  selectTileOptionByKey,
} from '@/store/slices/mapSelectors';
import { useGetGroundDataPointsQuery } from '@/modules/map/mapApi';
import { toApiDate, toDisplayDateTime } from '@/shared/lib/date';
import { toDms } from '@/shared/lib/location';
import redPoint from '@/modules/map/data/redpoint.png';
import './GroundDataMarkers.scss';

const MAX_RENDERED_POINTS = 12000;

const markerIcon = L.icon({
  iconUrl: redPoint,
  className: 'ground-data-marker-icon-soft',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -12],
});

interface PreparedGroundPoint {
  key: string;
  position: [number, number];
  dateLabel: string;
  latLabel: string;
  lonLabel: string;
  value: string;
  sensor: string;
}

export const GroundDataMarkers = () => {
  const dispatch = useAppDispatch();
  const isVisible = useAppSelector(selectIsPointsVisible);
  const type = useAppSelector(selectTileOptionByKey('type'));
  const options = useAppSelector(selectGroundDataOptions);
  const truncatedWarningKeyRef = useRef('');
  const errorWarningKeyRef = useRef('');

  const requestArgs = useMemo(
    () => ({
      source: String(options.source || ''),
      parameter: String(options.parameter || ''),
      startDate: toApiDate(options.startDate) || '',
      endDate: toApiDate(options.endDate),
    }),
    [options.endDate, options.parameter, options.source, options.startDate],
  );

  const isGroundDataMode = type === 'groundData';
  const hasRequiredFilters = Boolean(
    requestArgs.startDate && requestArgs.parameter && requestArgs.source,
  );

  const { data = [], isError } = useGetGroundDataPointsQuery(requestArgs, {
    skip: !isVisible || !isGroundDataMode || !hasRequiredFilters,
    refetchOnMountOrArgChange: false,
  });

  const sampledData = useMemo(() => {
    if (data.length <= MAX_RENDERED_POINTS) {
      return data;
    }

    const step = Math.ceil(data.length / MAX_RENDERED_POINTS);
    const next: typeof data = [];

    for (let index = 0; index < data.length; index += step) {
      next.push(data[index]);
    }

    return next;
  }, [data]);

  useEffect(() => {
    if (!isVisible || !isGroundDataMode || !hasRequiredFilters) {
      errorWarningKeyRef.current = '';
      return;
    }

    if (!isError) {
      errorWarningKeyRef.current = '';
      return;
    }

    const warningKey = `${requestArgs.parameter}|${requestArgs.source}|${requestArgs.startDate}|${
      requestArgs.endDate ?? ''
    }|error`;

    if (errorWarningKeyRef.current === warningKey) {
      return;
    }

    errorWarningKeyRef.current = warningKey;
    dispatch(appActions.showWarning('Не удалось загрузить наземные точки для выбранного диапазона.'));
  }, [
    dispatch,
    hasRequiredFilters,
    isError,
    isGroundDataMode,
    isVisible,
    requestArgs.endDate,
    requestArgs.parameter,
    requestArgs.source,
    requestArgs.startDate,
  ]);

  useEffect(() => {
    if (!isVisible || !isGroundDataMode || !hasRequiredFilters) {
      truncatedWarningKeyRef.current = '';
      return;
    }

    if (data.length <= MAX_RENDERED_POINTS) {
      truncatedWarningKeyRef.current = '';
      return;
    }

    const warningKey = `${requestArgs.parameter}|${requestArgs.source}|${requestArgs.startDate}|${
      requestArgs.endDate ?? ''
    }|${data.length}`;

    if (truncatedWarningKeyRef.current === warningKey) {
      return;
    }

    truncatedWarningKeyRef.current = warningKey;
    dispatch(
      appActions.showWarning(
        `Найдено ${data.length} точек. Для ускорения отображаются ${sampledData.length}. Уточните диапазон дат для полной детализации на карте.`,
      ),
    );
  }, [
    data.length,
    dispatch,
    hasRequiredFilters,
    isGroundDataMode,
    isVisible,
    requestArgs.endDate,
    requestArgs.parameter,
    requestArgs.source,
    requestArgs.startDate,
    sampledData.length,
  ]);

  const preparedPoints = useMemo<PreparedGroundPoint[]>(
    () =>
      sampledData.map((point, index) => ({
        key: `${point.latitude}-${point.longitude}-${point.date.toISOString()}-${index}`,
        position: [point.latitude, point.longitude],
        dateLabel: toDisplayDateTime(dayjs(point.date)),
        latLabel: toDms(point.latitude, false),
        lonLabel: toDms(point.longitude, true),
        value: point.value,
        sensor: point.sensor,
      })),
    [sampledData],
  );

  if (!isVisible || !isGroundDataMode || !hasRequiredFilters || !preparedPoints.length) {
    return null;
  }

  return (
    <MarkerClusterGroup
      spiderfyDistanceMultiplier={4}
      zoomToBoundsOnClick
      showCoverageOnHover={false}
      removeOutsideVisibleBounds
      disableClusteringAtZoom={19}
      maxClusterRadius={84}
      singleMarkerMode={false}
      chunkedLoading
      chunkInterval={120}
      chunkDelay={35}
      animate={false}
      animateAddingMarkers={false}
    >
      {preparedPoints.map((point) => (
        <Marker key={point.key} position={point.position} icon={markerIcon}>
          <Popup closeButton={false}>
            {`Дата: ${point.dateLabel}`}
            <br />
            {`Широта: ${point.latLabel}`}
            <br />
            {`Долгота: ${point.lonLabel}`}
            <br />
            {`Значение: ${point.value}`}
            <br />
            {`Источник: ${point.sensor}`}
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
};
