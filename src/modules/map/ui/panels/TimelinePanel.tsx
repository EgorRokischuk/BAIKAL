import { type Dayjs } from 'dayjs';
import { Alert, Button, Chip, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectTileOptions } from '@/store/slices/mapSelectors';
import { AvailabilityDatePicker } from './AvailabilityDatePicker';
import { buildCalendarAvailability, formatDateLabel, isDateAvailable } from './calendarAvailability';
import { useAvailableDates } from './dateUtils';

interface TimelinePanelProps {
  isLoading: boolean;
  isPreparing: boolean;
  preparedCount: number;
  totalCount: number;
  estimatedSecondsRemaining: number | null;
  isRunning: boolean;
  isPaused: boolean;
  currentFrameLabel: string;
  onStartTimeline: (frameDates: Dayjs[], intervalMs: number) => Promise<void>;
  onStopTimeline: () => void;
}

const SUPPORTED_TYPES = ['landsat', 'monthlyAvg', 'monthlyAvgManyYears', 'chlorophyll'] as const;
type SupportedType = (typeof SUPPORTED_TYPES)[number];

const isSupportedType = (value: string): value is SupportedType =>
  SUPPORTED_TYPES.includes(value as SupportedType);

const SPEED_OPTIONS = [
  { value: 450, label: 'Быстро (0.45с)' },
  { value: 800, label: 'Стандарт (0.8с)' },
  { value: 1200, label: 'Медленно (1.2с)' },
] as const;

const formatRemainingTime = (seconds: number | null) => {
  if (seconds === null) return '...';
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const restSeconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(restSeconds).padStart(2, '0')}`;
};

const resolvePickerConfig = (type: string) => {
  if (type === 'landsat') {
    return {
      views: ['year', 'month', 'day'] as const,
      openTo: 'year' as const,
      format: 'DD.MM.YYYY',
    };
  }

  if (type === 'monthlyAvgManyYears') {
    return {
      views: ['month'] as const,
      openTo: 'month' as const,
      format: 'MM',
    };
  }

  if (type === 'monthlyAvg' || type === 'chlorophyll') {
    return {
      views: ['year', 'month'] as const,
      openTo: 'year' as const,
      format: 'MM.YYYY',
    };
  }

  return {};
};

export const TimelinePanel = ({
  isLoading,
  isPreparing,
  preparedCount,
  totalCount,
  estimatedSecondsRemaining,
  isRunning,
  isPaused,
  currentFrameLabel,
  onStartTimeline,
  onStopTimeline,
}: TimelinePanelProps) => {
  const tileOptions = useAppSelector(selectTileOptions);
  const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(null);
  const [intervalMs, setIntervalMs] = useState<number>(SPEED_OPTIONS[1].value);

  const canAnimate =
    tileOptions.productType === 'baikalRiver' &&
    isSupportedType(tileOptions.type) &&
    Boolean(tileOptions.parameter) &&
    Boolean(tileOptions.source);

  const { data: availableDates, isLoading: datesLoading } = useAvailableDates(
    tileOptions.type,
    tileOptions,
  );

  const availability = useMemo(
    () => buildCalendarAvailability(tileOptions.type, availableDates),
    [availableDates, tileOptions.type],
  );

  const resolvedStartDate = useMemo(() => {
    if (!availability.items.length) return null;
    if (isDateAvailable(tileOptions.type, selectedStartDate, availability.keys)) {
      return selectedStartDate;
    }
    return availability.items[0];
  }, [availability.items, availability.keys, selectedStartDate, tileOptions.type]);

  const resolvedEndDate = useMemo(() => {
    if (!availability.items.length) return null;
    if (isDateAvailable(tileOptions.type, selectedEndDate, availability.keys)) {
      return selectedEndDate;
    }
    return availability.items[availability.items.length - 1];
  }, [availability.items, availability.keys, selectedEndDate, tileOptions.type]);

  const frameDates = useMemo(() => {
    if (!resolvedStartDate || !resolvedEndDate) return [];

    const start = Math.min(resolvedStartDate.valueOf(), resolvedEndDate.valueOf());
    const end = Math.max(resolvedStartDate.valueOf(), resolvedEndDate.valueOf());

    return availability.items.filter((item) => item.valueOf() >= start && item.valueOf() <= end);
  }, [availability.items, resolvedEndDate, resolvedStartDate]);

  const pickerConfig = resolvePickerConfig(tileOptions.type);

  const startDisabled =
    !canAnimate ||
    datesLoading ||
    isLoading ||
    isPreparing ||
    frameDates.length < 2;

  const stopDisabled = !isPreparing && !isRunning && !isPaused;

  const productLabel = `${tileOptions.parameter || '-'} / ${tileOptions.source || '-'}`;

  return (
    <Stack spacing={1.4}>
      <Typography variant="body2" color="text.secondary">
        Таймлайн-анимация изменения слоя за выбранный период.
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip size="small" label={`Режим: ${tileOptions.type || '-'}`} />
        <Chip size="small" label={`Продукт: ${productLabel}`} />
        <Chip size="small" label={`Кадров в периоде: ${frameDates.length}`} />
      </Stack>

      {!canAnimate && (
        <Alert severity="info" variant="outlined">
          Сначала настройте готовый продукт (параметр, источник и тип данных), затем откройте
          таймлайн.
        </Alert>
      )}

      {canAnimate && (
        <>
          <AvailabilityDatePicker
            type={tileOptions.type}
            label="Начало периода"
            value={resolvedStartDate}
            onChange={setSelectedStartDate}
            availableDates={availableDates}
            isLoading={datesLoading || isLoading}
            disabled={isPreparing}
            {...pickerConfig}
          />

          <AvailabilityDatePicker
            type={tileOptions.type}
            label="Конец периода"
            value={resolvedEndDate}
            onChange={setSelectedEndDate}
            availableDates={availableDates}
            isLoading={datesLoading || isLoading}
            disabled={isPreparing}
            {...pickerConfig}
          />

          <FormControl size="small" fullWidth disabled={isPreparing}>
            <InputLabel id="timeline-speed-label">Скорость</InputLabel>
            <Select
              labelId="timeline-speed-label"
              value={intervalMs}
              label="Скорость"
              onChange={(event) => {
                setIntervalMs(Number(event.target.value));
              }}
            >
              {SPEED_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="caption" color="text.secondary">
            {`Период: ${formatDateLabel(tileOptions.type, resolvedStartDate)} - ${formatDateLabel(tileOptions.type, resolvedEndDate)}`}
          </Typography>

          {isPreparing && (
            <Typography variant="caption" color="text.secondary">
              {`Предзагрузка кадров: ${preparedCount}/${totalCount} · осталось ~${formatRemainingTime(estimatedSecondsRemaining)}`}
            </Typography>
          )}

          {isRunning && currentFrameLabel && (
            <Typography variant="caption" color="text.secondary">
              {`Сейчас на карте: ${currentFrameLabel}`}
            </Typography>
          )}

          {isPaused && currentFrameLabel && (
            <Typography variant="caption" color="text.secondary">
              {`Таймлайн на паузе: ${currentFrameLabel}`}
            </Typography>
          )}

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              disabled={startDisabled}
              onClick={() => {
                void onStartTimeline(frameDates, intervalMs);
              }}
            >
              Запустить таймлайн
            </Button>

            <Button variant="outlined" color="inherit" onClick={onStopTimeline} disabled={stopDisabled}>
              Остановить
            </Button>
          </Stack>
        </>
      )}
    </Stack>
  );
};
