import dayjs from 'dayjs';
import { type DatePickerProps } from '@mui/x-date-pickers';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { mapActions } from '@/store/slices/mapSlice';
import { selectGroundDataOptions, selectMapDateByKey } from '@/store/slices/mapSelectors';
import { useAvailableDates } from './dateUtils';
import { AvailabilityDatePicker } from './AvailabilityDatePicker';

interface TileDateControlProps extends Omit<DatePickerProps, 'value' | 'onChange'> {
  type: string;
  dateKey?: 'startDate' | 'endDate';
}

export const TileDateControl = ({
  type,
  dateKey = 'startDate',
  views: propViews,
  openTo: propOpenTo,
  format: propFormat,
  label,
  ...props
}: TileDateControlProps) => {
  const dispatch = useAppDispatch();
  const value = useAppSelector(selectMapDateByKey(dateKey));
  const groundOptions = useAppSelector(selectGroundDataOptions);
  const tileOptions = useAppSelector((state) => state.map.tileOptions);
  const { data: availableDates, isLoading } = useAvailableDates(type, tileOptions);

  const isMonthOnly = type === 'monthlyAvgManyYears';

  const resolvedViews = propViews ?? (isMonthOnly ? ['month'] : undefined);
  const resolvedOpenTo =
    propOpenTo ??
    (resolvedViews?.includes('year')
      ? 'year'
      : resolvedViews?.includes('month')
        ? 'month'
        : undefined);

  const resolvedFormat =
    propFormat ??
    (resolvedViews
      ? resolvedViews.length === 1 && resolvedViews[0] === 'month'
        ? 'MM'
        : resolvedViews.includes('year') &&
            resolvedViews.includes('month') &&
            resolvedViews.length === 2
          ? 'MM.YYYY'
          : undefined
      : undefined);

  const groundStartDate = groundOptions.startDate ? dayjs(groundOptions.startDate) : null;
  const groundEndDate = groundOptions.endDate ? dayjs(groundOptions.endDate) : null;

  const minDate =
    type === 'groundData' && dateKey === 'endDate' && groundStartDate ? groundStartDate : undefined;

  const maxDate =
    type === 'groundData' && dateKey === 'startDate' && groundEndDate ? groundEndDate : undefined;

  return (
    <AvailabilityDatePicker
      {...props}
      type={type}
      label={label ?? 'Дата'}
      value={value}
      onChange={(nextDate) => {
        dispatch(mapActions.setMapDate({ key: dateKey, value: nextDate }));
      }}
      availableDates={availableDates}
      isLoading={isLoading}
      views={resolvedViews}
      openTo={resolvedOpenTo}
      format={resolvedFormat}
      minDate={minDate}
      maxDate={maxDate}
    />
  );
};
