import DownloadIcon from '@mui/icons-material/Download';
import {
  Box,
  Button,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Slider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import type { Dayjs } from 'dayjs';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { BASE_MAPS } from '@/modules/map/data/baseMaps';
import { env } from '@/shared/config/env';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { appActions } from '@/store/slices/appSlice';
import { mapActions } from '@/store/slices/mapSlice';
import { geeActions } from '@/store/slices/geeSlice';
import {
  selectBaseMapId,
  selectCompareState,
  selectGroundDataOptions,
  selectIsPointsVisible,
  selectTileLink,
  selectTileOpacity,
  selectTileOptions,
} from '@/store/slices/mapSelectors';
import { selectIsLoading } from '@/store/slices/appSelectors';
import {
  useGetChlorophyllFileMutation,
  useGetChlorophyllTileLinkMutation,
  useGetChlorophyllTileLinkRawMutation,
  useGetLandsatFileMutation,
  useGetLandsatTileLinkMutation,
  useGetLandsatTileLinkRawMutation,
  useLazyGetGroundDataPointsQuery,
  useGetMonthlyAvgFileMutation,
  useGetMonthlyAvgManyYearsFileMutation,
  useGetMonthlyAvgManyYearsTileLinkMutation,
  useGetMonthlyAvgManyYearsTileLinkRawMutation,
  useGetMonthlyAvgTileLinkMutation,
  useGetMonthlyAvgTileLinkRawMutation,
} from '@/modules/map/mapApi';
import type { GetTileLinkResponse } from '@/modules/map/model/types';
import { exportToExcel } from '@/shared/lib/excel';
import { toApiDate } from '@/shared/lib/date';
import { GeePanel } from './GeePanel';
import { GroundDataPanel } from './GroundDataPanel';
import { ReadyProductsPanel } from './ReadyProductsPanel';
import { ComparePanel } from './ComparePanel';
import { TimelinePanel } from './TimelinePanel';
import { formatDateLabel } from './calendarAvailability';
import styles from './MapPanel.module.scss';

type PanelSection = 'ready' | 'compare' | 'timeline' | 'gee' | 'ground';

const sliderStep = 5;
const readyTypes = ['landsat', 'monthlyAvg', 'monthlyAvgManyYears', 'chlorophyll'] as const;
const isReadyType = (type: string): type is (typeof readyTypes)[number] =>
  readyTypes.includes(type as (typeof readyTypes)[number]);

export interface TimelineOverlayState {
  active: boolean;
  isPreparing: boolean;
  isRunning: boolean;
  isPaused: boolean;
  preparedCount: number;
  totalCount: number;
  estimatedSecondsRemaining: number | null;
  currentFrameLabel: string;
}

export interface TimelineOverlayControls {
  togglePlayback: () => void;
  stepBackward: () => void;
  stepForward: () => void;
  finish: () => void;
}

interface MapPanelProps {
  onRequestHidePanel?: () => void;
  onTimelinePrepare?: () => Promise<void> | void;
  onTimelineWarmup?: (frameLinks: string[]) => Promise<void> | void;
  onTimelineStateChange?: (state: TimelineOverlayState) => void;
  onTimelineControlsChange?: (controls: TimelineOverlayControls | null) => void;
  onTimelineFinished?: () => void;
}

interface TimelineFrame {
  date: Dayjs;
  link: string;
  legend: { min: number; max: number } | null;
}

interface TimelineStatusState {
  isPreparing: boolean;
  isRunning: boolean;
  isPaused: boolean;
  preparedCount: number;
  totalCount: number;
  estimatedSecondsRemaining: number | null;
  currentFrameLabel: string;
}

const getLegendFromTileResponse = (response: Partial<GetTileLinkResponse>) => {
  const min = response.min_temp ?? response.min;
  const max = response.max_temp ?? response.max;

  if (typeof min === 'number' && typeof max === 'number') {
    return { min, max };
  }

  return null;
};

const resolveDownloadUrl = (rawLink: string): string => {
  const link = String(rawLink ?? '')
    .trim()
    .replace(/^"+|"+$/g, '');

  if (!link) {
    return '';
  }

  if (/^https?:\/\//i.test(link)) {
    return link;
  }

  if (link.startsWith('/api/') || link.startsWith('api/')) {
    return link.startsWith('/') ? link : `/${link}`;
  }

  if (link.startsWith('/files/') || link.startsWith('files/')) {
    const apiBase = env.apiUrl.replace(/\/$/, '');
    const normalizedLink = link.startsWith('/') ? link : `/${link}`;
    return `${apiBase}${normalizedLink}`;
  }

  return `${env.tileApiUrl}${link}`;
};

export const MapPanel = ({
  onRequestHidePanel,
  onTimelinePrepare,
  onTimelineWarmup,
  onTimelineStateChange,
  onTimelineControlsChange,
  onTimelineFinished,
}: MapPanelProps) => {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(selectIsLoading);
  const tileLink = useAppSelector(selectTileLink);
  const tileOpacity = useAppSelector(selectTileOpacity);
  const tileOptions = useAppSelector(selectTileOptions);
  const groundDataOptions = useAppSelector(selectGroundDataOptions);
  const isPointsVisible = useAppSelector(selectIsPointsVisible);
  const compareState = useAppSelector(selectCompareState);
  const baseMapId = useAppSelector(selectBaseMapId);

  const [section, setSection] = useState<PanelSection>('ready');
  const [baseMapMenuAnchor, setBaseMapMenuAnchor] = useState<HTMLElement | null>(null);
  const [timelineStatus, setTimelineStatus] = useState<TimelineStatusState>({
    isPreparing: false,
    isRunning: false,
    isPaused: false,
    preparedCount: 0,
    totalCount: 0,
    estimatedSecondsRemaining: null,
    currentFrameLabel: '',
  });

  const timelineFramesRef = useRef<TimelineFrame[]>([]);
  const timelineTimerRef = useRef<number | null>(null);
  const timelineRunIdRef = useRef(0);
  const timelineFrameIndexRef = useRef(0);
  const timelineIntervalMsRef = useRef(800);
  const timelineTypeRef = useRef(tileOptions.type);
  const isBaseMapMenuOpen = Boolean(baseMapMenuAnchor);

  const [getLandsatTileLink, landsatLoading] = useGetLandsatTileLinkMutation();
  const [getMonthlyAvgTileLink, monthlyLoading] = useGetMonthlyAvgTileLinkMutation();
  const [getMonthlyAvgManyYearsTileLink, monthlyManyYearsLoading] =
    useGetMonthlyAvgManyYearsTileLinkMutation();
  const [getChlorophyllTileLink, chlorophyllLoading] = useGetChlorophyllTileLinkMutation();

  const [getLandsatTileLinkRaw] = useGetLandsatTileLinkRawMutation();
  const [getMonthlyAvgTileLinkRaw] = useGetMonthlyAvgTileLinkRawMutation();
  const [getMonthlyAvgManyYearsTileLinkRaw] = useGetMonthlyAvgManyYearsTileLinkRawMutation();
  const [getChlorophyllTileLinkRaw] = useGetChlorophyllTileLinkRawMutation();

  const [getLandsatFile, landsatFileLoading] = useGetLandsatFileMutation();
  const [getMonthlyAvgFile, monthlyFileLoading] = useGetMonthlyAvgFileMutation();
  const [getMonthlyAvgManyYearsFile, monthlyManyYearsFileLoading] =
    useGetMonthlyAvgManyYearsFileMutation();
  const [getChlorophyllFile, chlorophyllFileLoading] = useGetChlorophyllFileMutation();

  const [loadGroundDataPoints, groundDataPointsState] = useLazyGetGroundDataPointsQuery();

  const groundDataRequestArgs = useMemo(
    () => ({
      parameter: String(groundDataOptions.parameter || ''),
      source: String(groundDataOptions.source || ''),
      startDate: toApiDate(groundDataOptions.startDate) || '',
      endDate: toApiDate(groundDataOptions.endDate),
    }),
    [
      groundDataOptions.endDate,
      groundDataOptions.parameter,
      groundDataOptions.source,
      groundDataOptions.startDate,
    ],
  );

  const loadingTile =
    landsatLoading.isLoading ||
    monthlyLoading.isLoading ||
    monthlyManyYearsLoading.isLoading ||
    chlorophyllLoading.isLoading;

  const loadingFile =
    landsatFileLoading.isLoading ||
    monthlyFileLoading.isLoading ||
    monthlyManyYearsFileLoading.isLoading ||
    chlorophyllFileLoading.isLoading;

  const clearTimelineTimer = useCallback(() => {
    if (timelineTimerRef.current !== null) {
      window.clearInterval(timelineTimerRef.current);
      timelineTimerRef.current = null;
    }
  }, []);

  const applyTimelineFrame = useCallback(
    (frame: TimelineFrame, type: string) => {
      dispatch(mapActions.setTileLink(frame.link));
      if (frame.legend) {
        dispatch(mapActions.setLegend(frame.legend));
      } else {
        dispatch(mapActions.hideLegend());
      }

      setTimelineStatus((prev) => ({
        ...prev,
        currentFrameLabel: formatDateLabel(type, frame.date),
      }));
    },
    [dispatch],
  );

  const startTimelinePlaybackLoop = useCallback(
    (runId: number) => {
      clearTimelineTimer();

      if (typeof window === 'undefined') {
        return;
      }

      timelineTimerRef.current = window.setInterval(() => {
        if (timelineRunIdRef.current !== runId || !timelineFramesRef.current.length) {
          return;
        }

        const nextFrameIndex = timelineFrameIndexRef.current + 1;
        if (nextFrameIndex >= timelineFramesRef.current.length) {
          clearTimelineTimer();
          setTimelineStatus((prev) => ({
            ...prev,
            isRunning: false,
            isPaused: true,
          }));
          return;
        }

        timelineFrameIndexRef.current = nextFrameIndex;
        const frame = timelineFramesRef.current[nextFrameIndex];
        applyTimelineFrame(frame, timelineTypeRef.current);
      }, timelineIntervalMsRef.current);
    },
    [applyTimelineFrame, clearTimelineTimer],
  );

  const stopTimeline = useCallback(
    (preserveCurrentLayer = true) => {
      timelineRunIdRef.current += 1;
      clearTimelineTimer();
      timelineFramesRef.current = [];
      timelineFrameIndexRef.current = 0;

      setTimelineStatus({
        isPreparing: false,
        isRunning: false,
        isPaused: false,
        preparedCount: 0,
        totalCount: 0,
        estimatedSecondsRemaining: null,
        currentFrameLabel: '',
      });

      if (!preserveCurrentLayer) {
        dispatch(mapActions.setTileLink(''));
        dispatch(mapActions.hideLegend());
      }
    },
    [clearTimelineTimer, dispatch],
  );

  useEffect(() => {
    onTimelineStateChange?.({
      active: timelineStatus.isPreparing || timelineStatus.isRunning || timelineStatus.isPaused,
      ...timelineStatus,
    });
  }, [onTimelineStateChange, timelineStatus]);

  useEffect(() => {
    return () => {
      stopTimeline(true);
      dispatch(geeActions.clearShape());
      onTimelineControlsChange?.(null);
    };
  }, [dispatch, onTimelineControlsChange, stopTimeline]);

  const setProductType = (next: PanelSection) => {
    if (next === 'ground') {
      dispatch(mapActions.setTileOption({ key: 'productType', value: 'groundData' }));
      return;
    }

    if (next === 'gee') {
      dispatch(mapActions.setTileOption({ key: 'productType', value: 'gee' }));
      return;
    }

    dispatch(mapActions.setTileOption({ key: 'productType', value: 'baikalRiver' }));
  };

  const clearGeePolygon = useCallback(() => {
    dispatch(geeActions.clearShape());
  }, [dispatch]);

  const onToggleCompareSection = () => {
    if (section === 'compare') {
      clearGeePolygon();
      setSection('ready');
      setProductType('ready');
      dispatch(mapActions.setCompareEnabled(false));
      return;
    }

    stopTimeline(true);
    clearGeePolygon();
    setSection('compare');
    setProductType('compare');
  };

  const onToggleTimelineSection = () => {
    if (section === 'timeline') {
      stopTimeline(true);
      clearGeePolygon();
      setSection('ready');
      setProductType('ready');
      return;
    }

    dispatch(mapActions.setCompareEnabled(false));
    stopTimeline(true);
    clearGeePolygon();
    setSection('timeline');
    setProductType('timeline');
  };

  const onOpenBaseMapMenu = (event: ReactMouseEvent<HTMLElement>) => {
    setBaseMapMenuAnchor(event.currentTarget);
  };

  const onCloseBaseMapMenu = () => {
    setBaseMapMenuAnchor(null);
  };

  const onSelectBaseMap = (nextBaseMapId: (typeof BASE_MAPS)[number]['id']) => {
    dispatch(mapActions.setBaseMap(nextBaseMapId));
    onCloseBaseMapMenu();
  };

  const showTileDisabled = useMemo(() => {
    if (tileLink) return false;

    if (!tileOptions.productType || !tileOptions.parameter || !tileOptions.source) return true;

    switch (tileOptions.type) {
      case 'landsat':
        return !tileOptions.startDate;
      case 'monthlyAvg':
      case 'monthlyAvgManyYears':
        return !tileOptions.photoTime || !tileOptions.startDate;
      case 'chlorophyll':
        return !tileOptions.startDate;
      default:
        return true;
    }
  }, [tileLink, tileOptions]);

  const onShowTile = async () => {
    if (tileLink) {
      dispatch(mapActions.setTileLink(''));
      return;
    }

    stopTimeline(true);
    dispatch(mapActions.setCompareEnabled(false));

    let response:
      | { data?: { link?: string } }
      | { error?: unknown }
      | null = null;

    switch (tileOptions.type) {
      case 'landsat':
        response = await getLandsatTileLink(tileOptions);
        break;
      case 'monthlyAvg':
        response = await getMonthlyAvgTileLink(tileOptions);
        break;
      case 'monthlyAvgManyYears':
        response = await getMonthlyAvgManyYearsTileLink(tileOptions);
        break;
      case 'chlorophyll':
        response = await getChlorophyllTileLink(tileOptions);
        break;
      default:
        response = null;
    }

    if (response && 'data' in response && response.data?.link) {
      onRequestHidePanel?.();
    }
  };

  const onDownload = async () => {
    const downloadWindow = window.open('', '_blank');

    try {
      let fileLink = '';

      switch (tileOptions.type) {
        case 'landsat':
          fileLink = await getLandsatFile(tileOptions).unwrap();
          break;
        case 'monthlyAvg':
          fileLink = await getMonthlyAvgFile(tileOptions).unwrap();
          break;
        case 'monthlyAvgManyYears':
          fileLink = await getMonthlyAvgManyYearsFile(tileOptions).unwrap();
          break;
        case 'chlorophyll':
          fileLink = await getChlorophyllFile(tileOptions).unwrap();
          break;
        default:
          fileLink = '';
      }

      const downloadUrl = resolveDownloadUrl(fileLink);
      if (!downloadUrl) {
        throw new Error('EMPTY_DOWNLOAD_URL');
      }

      const absoluteDownloadUrl = /^https?:\/\//i.test(downloadUrl)
        ? downloadUrl
        : new URL(downloadUrl, window.location.origin).toString();

      if (downloadWindow) {
        downloadWindow.location.replace(absoluteDownloadUrl);
      } else {
        window.open(absoluteDownloadUrl, '_blank');
      }
    } catch (error) {
      if (downloadWindow && !downloadWindow.closed) {
        downloadWindow.close();
      }

      const statusFromError =
        typeof error === 'object' && error !== null && 'status' in error
          ? Number((error as { status?: number | string }).status)
          : null;
      const statusFromOriginal =
        typeof error === 'object' && error !== null && 'originalStatus' in error
          ? Number((error as { originalStatus?: number | string }).originalStatus)
          : null;
      const status = Number.isFinite(statusFromError ?? NaN)
        ? statusFromError
        : Number.isFinite(statusFromOriginal ?? NaN)
          ? statusFromOriginal
          : null;

      if (status === 401) {
        dispatch(appActions.showWarning('Скачивание доступно только после авторизации.'));
        return;
      }

      dispatch(appActions.showError('Не удалось скачать файл. Попробуйте снова.'));
    }
  };

  const onToggleGroundData = () => {
    const nextVisibility = !isPointsVisible;
    dispatch(mapActions.setPointsVisibility(nextVisibility));
    if (nextVisibility) {
      onRequestHidePanel?.();
    }
  };

  const onExportGroundData = async () => {
    if (
      !groundDataRequestArgs.startDate ||
      !groundDataRequestArgs.parameter ||
      !groundDataRequestArgs.source
    ) {
      return;
    }

    const response = await loadGroundDataPoints(groundDataRequestArgs, true);
    const points = 'data' in response ? response.data : undefined;

    if (!points?.length) {
      dispatch(appActions.showWarning('Нет данных для экспорта в выбранном диапазоне.'));
      return;
    }

    await exportToExcel(
      [
        { header: 'Дата', key: 'date', width: 20 },
        { header: 'Широта', key: 'latitude', width: 14 },
        { header: 'Долгота', key: 'longitude', width: 14 },
        { header: 'Значение', key: 'value', width: 14 },
        { header: 'Источник', key: 'sensor', width: 22 },
      ],
      points.map((point) => ({
        date: point.date.toISOString(),
        latitude: point.latitude,
        longitude: point.longitude,
        value: point.value,
        sensor: point.sensor,
      })),
      'ground_data',
      'GroundData',
    );
  };

  const onRunCompare = async (leftDate: Dayjs, rightDate: Dayjs) => {
    if (!isReadyType(tileOptions.type)) return;

    stopTimeline(true);

    const leftOptions = { ...tileOptions, startDate: leftDate, endDate: null };
    const rightOptions = { ...tileOptions, startDate: rightDate, endDate: null };

    let leftTileLink = '';
    let rightTileLink = '';

    switch (tileOptions.type) {
      case 'landsat': {
        const [left, right] = await Promise.all([
          getLandsatTileLink(leftOptions).unwrap(),
          getLandsatTileLink(rightOptions).unwrap(),
        ]);
        leftTileLink = left.link;
        rightTileLink = right.link;
        break;
      }
      case 'monthlyAvg': {
        const [left, right] = await Promise.all([
          getMonthlyAvgTileLink(leftOptions).unwrap(),
          getMonthlyAvgTileLink(rightOptions).unwrap(),
        ]);
        leftTileLink = left.link;
        rightTileLink = right.link;
        break;
      }
      case 'monthlyAvgManyYears': {
        const [left, right] = await Promise.all([
          getMonthlyAvgManyYearsTileLink(leftOptions).unwrap(),
          getMonthlyAvgManyYearsTileLink(rightOptions).unwrap(),
        ]);
        leftTileLink = left.link;
        rightTileLink = right.link;
        break;
      }
      case 'chlorophyll': {
        const [left, right] = await Promise.all([
          getChlorophyllTileLink(leftOptions).unwrap(),
          getChlorophyllTileLink(rightOptions).unwrap(),
        ]);
        leftTileLink = left.link;
        rightTileLink = right.link;
        break;
      }
      default:
        return;
    }

    dispatch(mapActions.setTileLink(''));
    dispatch(mapActions.setCompareTileLinks({ leftTileLink, rightTileLink }));
    dispatch(mapActions.setCompareEnabled(true));
    onRequestHidePanel?.();
  };

  const onStopCompare = () => {
    dispatch(mapActions.setCompareEnabled(false));
  };

  const pauseTimeline = useCallback(() => {
    if (timelineStatus.isPreparing || !timelineFramesRef.current.length) {
      return;
    }

    clearTimelineTimer();
    setTimelineStatus((prev) => ({
      ...prev,
      isRunning: false,
      isPaused: true,
    }));
  }, [clearTimelineTimer, timelineStatus.isPreparing]);

  const stepTimelineFrame = useCallback(
    (direction: -1 | 1) => {
      if (
        timelineStatus.isPreparing ||
        timelineStatus.isRunning ||
        !timelineFramesRef.current.length
      ) {
        return;
      }

      const maxIndex = timelineFramesRef.current.length - 1;
      const nextFrameIndex = Math.max(
        0,
        Math.min(maxIndex, timelineFrameIndexRef.current + direction),
      );

      if (nextFrameIndex === timelineFrameIndexRef.current) {
        return;
      }

      timelineFrameIndexRef.current = nextFrameIndex;
      const frame = timelineFramesRef.current[nextFrameIndex];
      applyTimelineFrame(frame, timelineTypeRef.current);

      setTimelineStatus((prev) => ({
        ...prev,
        isRunning: false,
        isPaused: true,
      }));
    },
    [applyTimelineFrame, timelineStatus.isPreparing, timelineStatus.isRunning],
  );

  const stepTimelineBackward = useCallback(() => {
    stepTimelineFrame(-1);
  }, [stepTimelineFrame]);

  const stepTimelineForward = useCallback(() => {
    stepTimelineFrame(1);
  }, [stepTimelineFrame]);

  const resumeTimeline = useCallback(() => {
    if (timelineStatus.isPreparing || !timelineFramesRef.current.length) {
      return;
    }

    if (timelineFrameIndexRef.current >= timelineFramesRef.current.length - 1) {
      return;
    }

    setTimelineStatus((prev) => ({
      ...prev,
      isRunning: true,
      isPaused: false,
    }));

    startTimelinePlaybackLoop(timelineRunIdRef.current);
  }, [startTimelinePlaybackLoop, timelineStatus.isPreparing]);

  const toggleTimelinePlayback = useCallback(() => {
    if (timelineStatus.isPreparing) {
      return;
    }

    if (timelineStatus.isRunning) {
      pauseTimeline();
      return;
    }

    if (timelineStatus.isPaused) {
      resumeTimeline();
    }
  }, [pauseTimeline, resumeTimeline, timelineStatus.isPaused, timelineStatus.isPreparing, timelineStatus.isRunning]);

  const finishTimeline = useCallback(() => {
    stopTimeline(true);
    onTimelineFinished?.();
  }, [onTimelineFinished, stopTimeline]);

  useEffect(() => {
    onTimelineControlsChange?.({
      togglePlayback: toggleTimelinePlayback,
      stepBackward: stepTimelineBackward,
      stepForward: stepTimelineForward,
      finish: finishTimeline,
    });
  }, [
    finishTimeline,
    onTimelineControlsChange,
    stepTimelineBackward,
    stepTimelineForward,
    toggleTimelinePlayback,
  ]);

  const requestTimelineTile = useCallback(
    async (options: typeof tileOptions) => {
      switch (options.type) {
        case 'landsat':
          return getLandsatTileLinkRaw(options).unwrap();
        case 'monthlyAvg':
          return getMonthlyAvgTileLinkRaw(options).unwrap();
        case 'monthlyAvgManyYears':
          return getMonthlyAvgManyYearsTileLinkRaw(options).unwrap();
        case 'chlorophyll':
          return getChlorophyllTileLinkRaw(options).unwrap();
        default:
          throw new Error('Timeline is not supported for selected type');
      }
    },
    [
      getChlorophyllTileLinkRaw,
      getLandsatTileLinkRaw,
      getMonthlyAvgManyYearsTileLinkRaw,
      getMonthlyAvgTileLinkRaw,
    ],
  );

  const onStartTimeline = useCallback(
    async (frameDates: Dayjs[], intervalMs: number) => {
      if (!isReadyType(tileOptions.type)) return;

      if (frameDates.length < 2) {
        dispatch(appActions.showWarning('Для анимации выберите период минимум из двух дат.'));
        return;
      }

      try {
        await onTimelinePrepare?.();
      } catch {
        // ignore
      }

      const runId = timelineRunIdRef.current + 1;
      timelineRunIdRef.current = runId;

      clearTimelineTimer();
      timelineFramesRef.current = [];
      timelineFrameIndexRef.current = 0;
      timelineIntervalMsRef.current = intervalMs;
      timelineTypeRef.current = tileOptions.type;

      dispatch(mapActions.setCompareEnabled(false));
      dispatch(mapActions.setTileLink(''));

      setTimelineStatus({
        isPreparing: true,
        isRunning: false,
        isPaused: false,
        preparedCount: 0,
        totalCount: frameDates.length,
        estimatedSecondsRemaining: null,
        currentFrameLabel: '',
      });

      const snapshot = { ...tileOptions, endDate: null };
      const frames: TimelineFrame[] = [];
      const preparationStartedAt =
        typeof performance !== 'undefined' ? performance.now() : Date.now();

      try {
        for (let index = 0; index < frameDates.length; index += 1) {
          if (timelineRunIdRef.current !== runId) {
            return;
          }

          const date = frameDates[index];
          const response = await requestTimelineTile({ ...snapshot, startDate: date });

          frames.push({
            date,
            link: response.link,
            legend: getLegendFromTileResponse(response),
          });

          const preparedCount = index + 1;
          const elapsedMs =
            (typeof performance !== 'undefined' ? performance.now() : Date.now()) -
            preparationStartedAt;
          const averageFrameMs = elapsedMs / preparedCount;
          const remainingFrames = frameDates.length - preparedCount;
          const estimatedSecondsRemaining =
            remainingFrames > 0
              ? Math.max(1, Math.round((averageFrameMs * remainingFrames) / 1000))
              : 0;

          setTimelineStatus((prev) => ({
            ...prev,
            preparedCount,
            totalCount: frameDates.length,
            estimatedSecondsRemaining,
          }));
        }
      } catch {
        if (timelineRunIdRef.current === runId) {
          setTimelineStatus({
            isPreparing: false,
            isRunning: false,
            isPaused: false,
            preparedCount: 0,
            totalCount: 0,
            estimatedSecondsRemaining: null,
            currentFrameLabel: '',
          });
          dispatch(appActions.showError('Не удалось подготовить таймлайн для выбранного периода.'));
        }
        return;
      }

      if (timelineRunIdRef.current !== runId || !frames.length) {
        return;
      }

      timelineFramesRef.current = frames;
      timelineTypeRef.current = snapshot.type;

      if (onTimelineWarmup) {
        try {
          await onTimelineWarmup(frames.map((frame) => frame.link));
        } catch {
          // ignore warmup errors
        }
      }

      if (timelineRunIdRef.current !== runId) {
        return;
      }

      const firstFrame = frames[0];
      timelineFrameIndexRef.current = 0;
      applyTimelineFrame(firstFrame, snapshot.type);

      setTimelineStatus({
        isPreparing: false,
        isRunning: true,
        isPaused: false,
        preparedCount: frames.length,
        totalCount: frames.length,
        estimatedSecondsRemaining: null,
        currentFrameLabel: formatDateLabel(snapshot.type, firstFrame.date),
      });

      onRequestHidePanel?.();
      startTimelinePlaybackLoop(runId);
    },
    [
      applyTimelineFrame,
      clearTimelineTimer,
      dispatch,
      onRequestHidePanel,
      onTimelinePrepare,
      onTimelineWarmup,
      requestTimelineTile,
      startTimelinePlaybackLoop,
      tileOptions,
    ],
  );

  const groundConfirmDisabled =
    isLoading ||
    !groundDataOptions.startDate ||
    !groundDataOptions.parameter ||
    !groundDataOptions.source;

  const opacityPercent = Math.round((tileOpacity * 100) / sliderStep) * sliderStep;

  const showReadyActions = section === 'ready';
  const showGroundActions = section === 'ground';

  return (
    <Box className={styles.panel}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
        flexWrap="wrap"
        useFlexGap
      >
        <Typography variant="h3">Данные</Typography>
        <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap alignItems="center">
          <Button
            variant={section === 'compare' ? 'contained' : 'outlined'}
            size="small"
            onClick={onToggleCompareSection}
          >
            {section === 'compare' ? 'Выйти из сравнения' : 'Сравнение дат'}
          </Button>
          <Button
            variant={section === 'timeline' ? 'contained' : 'outlined'}
            size="small"
            onClick={onToggleTimelineSection}
          >
            {section === 'timeline' ? 'Закрыть таймлайн' : 'Таймлайн'}
          </Button>
          <IconButton
            size="small"
            className={styles.baseMapMenuTrigger}
            onClick={onOpenBaseMapMenu}
            aria-label="Выбор подложки карты"
          >
            <MoreHorizRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
      <Menu
        anchorEl={baseMapMenuAnchor}
        open={isBaseMapMenuOpen}
        onClose={onCloseBaseMapMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {BASE_MAPS.map((option) => (
          <MenuItem
            key={option.id}
            selected={option.id === baseMapId}
            onClick={() => onSelectBaseMap(option.id)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>

      {timelineStatus.isPreparing && timelineStatus.totalCount > 0 ? (
        <LinearProgress
          sx={{ mt: 0.5 }}
          variant="determinate"
          value={(timelineStatus.preparedCount / timelineStatus.totalCount) * 100}
        />
      ) : (
        (isLoading || loadingTile || loadingFile) && <LinearProgress sx={{ mt: 0.5 }} />
      )}

      <Tabs
        value={(() => {
          const index = ['ready', 'gee', 'ground'].indexOf(section);
          return index >= 0 ? index : false;
        })()}
        onChange={(_, index) => {
          const next = (['ready', 'gee', 'ground'][index] || 'ready') as PanelSection;
          if (next !== 'gee') {
            clearGeePolygon();
          }
          setSection(next);
          setProductType(next);
          if (compareState.enabled) {
            dispatch(mapActions.setCompareEnabled(false));
          }
          stopTimeline(true);
        }}
        variant="fullWidth"
        sx={{ mt: 0.5 }}
        className={styles.compactTabs}
      >
        <Tab label="Продукты" />
        <Tab label="Онлайн расчеты" />
        <Tab label="Наземные данные" />
      </Tabs>

      <Box className={styles.content}>
        {section === 'ready' && <ReadyProductsPanel />}
        {section === 'compare' && (
          <ComparePanel
            isLoading={loadingTile || isLoading}
            onRunCompare={onRunCompare}
            onStopCompare={onStopCompare}
          />
        )}
        {section === 'timeline' && (
          <TimelinePanel
            isLoading={loadingTile || isLoading}
            isPreparing={timelineStatus.isPreparing}
            preparedCount={timelineStatus.preparedCount}
            totalCount={timelineStatus.totalCount}
            estimatedSecondsRemaining={timelineStatus.estimatedSecondsRemaining}
            isRunning={timelineStatus.isRunning}
            isPaused={timelineStatus.isPaused}
            currentFrameLabel={timelineStatus.currentFrameLabel}
            onStartTimeline={onStartTimeline}
            onStopTimeline={() => stopTimeline(true)}
          />
        )}
        {section === 'gee' && <GeePanel />}
        {section === 'ground' && <GroundDataPanel />}
      </Box>

      {showReadyActions && (
        <Stack direction="row" spacing={1} className={styles.actions}>
          <Button variant="contained" onClick={onShowTile} disabled={loadingTile || showTileDisabled}>
            {tileLink ? 'Скрыть слой' : 'Показать слой'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={onDownload}
            disabled={!tileLink || loadingFile}
          >
            Скачать
          </Button>
        </Stack>
      )}

      {showGroundActions && (
        <Stack direction="row" spacing={1} className={styles.actions}>
          <Button variant="contained" onClick={onToggleGroundData} disabled={groundConfirmDisabled}>
            {isPointsVisible ? 'Скрыть точки' : 'Показать точки'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={onExportGroundData}
            disabled={!isPointsVisible || groundConfirmDisabled || groundDataPointsState.isFetching}
          >
            Экспорт XLSX
          </Button>
        </Stack>
      )}

      {(tileLink || compareState.enabled || timelineStatus.isRunning || timelineStatus.isPaused) && (
        <Box className={styles.opacityBox}>
          <Typography variant="caption">Прозрачность слоя: {opacityPercent}%</Typography>
          <Slider
            size="small"
            min={0}
            max={100}
            step={sliderStep}
            value={opacityPercent}
            onChange={(_, value) => {
              const next = Array.isArray(value) ? value[0] : value;
              dispatch(mapActions.setTileOpacity(next / 100));
            }}
          />
        </Box>
      )}
    </Box>
  );
};
