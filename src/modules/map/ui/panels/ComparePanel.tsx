import { type Dayjs } from 'dayjs';
import { Alert, Button, Chip, Stack, Typography } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { mapActions } from '@/store/slices/mapSlice';
import { selectCompareState, selectTileOptions } from '@/store/slices/mapSelectors';
import { AvailabilityDatePicker } from './AvailabilityDatePicker';
import {
  buildCalendarAvailability,
  formatDateLabel,
  getDateKey,
  isDateAvailable,
} from './calendarAvailability';
import { useAvailableDates } from './dateUtils';

interface ComparePanelProps {
  isLoading: boolean;
  onRunCompare: (leftDate: Dayjs, rightDate: Dayjs) => Promise<void>;
  onStopCompare: () => void;
}

const SUPPORTED_TYPES = ['landsat', 'monthlyAvg', 'monthlyAvgManyYears', 'chlorophyll'] as const;
type SupportedType = (typeof SUPPORTED_TYPES)[number];

const isSupportedType = (value: string): value is SupportedType =>
  SUPPORTED_TYPES.includes(value as SupportedType);

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

export const ComparePanel = ({ isLoading, onRunCompare, onStopCompare }: ComparePanelProps) => {
  const dispatch = useAppDispatch();
  const tileOptions = useAppSelector(selectTileOptions);
  const compare = useAppSelector(selectCompareState);

  const canCompare =
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

  const leftKey =
    canCompare && isSupportedType(tileOptions.type)
      ? getDateKey(tileOptions.type, compare.leftDate)
      : '';

  const rightKey =
    canCompare && isSupportedType(tileOptions.type)
      ? getDateKey(tileOptions.type, compare.rightDate)
      : '';

  useEffect(() => {
    if (!canCompare || !isSupportedType(tileOptions.type) || !availability.items.length) return;

    const leftExists = isDateAvailable(tileOptions.type, compare.leftDate, availability.keys);
    const rightExists = isDateAvailable(tileOptions.type, compare.rightDate, availability.keys);

    if (!leftExists) {
      dispatch(mapActions.setCompareDate({ side: 'left', value: availability.items[0] }));
      return;
    }

    if (!rightExists || rightKey === leftKey) {
      const fallback = availability.items[1] ?? availability.items[0];
      dispatch(mapActions.setCompareDate({ side: 'right', value: fallback }));
    }
  }, [
    availability.items,
    availability.keys,
    canCompare,
    compare.leftDate,
    compare.rightDate,
    dispatch,
    leftKey,
    rightKey,
    tileOptions.type,
  ]);

  const startDisabled =
    !canCompare ||
    !compare.leftDate ||
    !compare.rightDate ||
    availability.items.length < 2 ||
    leftKey === rightKey ||
    isLoading ||
    datesLoading;

  const currentProductLabel = `${tileOptions.parameter || '-'} / ${tileOptions.source || '-'}`;
  const pickerConfig = resolvePickerConfig(tileOptions.type);

  return (
    <Stack spacing={1.4}>
      <Typography variant="body2" color="text.secondary">
        Сравнение двух дат одного и того же продукта в режиме разделенного экрана.
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip size="small" label={`Режим: ${tileOptions.type || '-'}`} />
        <Chip size="small" label={`Продукт: ${currentProductLabel}`} />
        <Chip size="small" label={`Доступно дат: ${availability.items.length}`} />
      </Stack>

      {!canCompare && (
        <Alert severity="info" variant="outlined">
          Сначала настройте готовый продукт (параметр, источник и тип данных), затем откройте
          сравнение.
        </Alert>
      )}

      {canCompare && (
        <>
          <AvailabilityDatePicker
            type={tileOptions.type}
            label="Дата A"
            value={compare.leftDate}
            onChange={(nextDate) => {
              dispatch(mapActions.setCompareDate({ side: 'left', value: nextDate }));
            }}
            availableDates={availableDates}
            isLoading={datesLoading || isLoading}
            disabled={!canCompare}
            {...pickerConfig}
          />

          <AvailabilityDatePicker
            type={tileOptions.type}
            label="Дата B"
            value={compare.rightDate}
            onChange={(nextDate) => {
              dispatch(mapActions.setCompareDate({ side: 'right', value: nextDate }));
            }}
            availableDates={availableDates}
            isLoading={datesLoading || isLoading}
            disabled={!canCompare}
            {...pickerConfig}
          />

          <Typography variant="caption" color="text.secondary">
            {`A: ${formatDateLabel(tileOptions.type, compare.leftDate)} | B: ${formatDateLabel(tileOptions.type, compare.rightDate)}`}
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              disabled={startDisabled}
              onClick={() => {
                if (compare.leftDate && compare.rightDate) {
                  void onRunCompare(compare.leftDate, compare.rightDate);
                }
              }}
            >
              Открыть сравнение
            </Button>

            <Button
              variant="outlined"
              color="inherit"
              onClick={onStopCompare}
              disabled={!compare.enabled}
            >
              Закрыть сравнение
            </Button>
          </Stack>
        </>
      )}
    </Stack>
  );
};
