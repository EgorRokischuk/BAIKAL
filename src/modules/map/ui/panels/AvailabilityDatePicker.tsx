import dayjs, { type Dayjs } from 'dayjs';
import { type DragEvent, useMemo } from 'react';
import { DatePicker, type DatePickerProps } from '@mui/x-date-pickers';
import { toApiDate } from '@/shared/lib/date';
import { buildCalendarAvailability } from './calendarAvailability';

interface AvailabilityDatePickerProps
  extends Omit<DatePickerProps, 'value' | 'onChange' | 'label'> {
  type: string;
  label: DatePickerProps['label'];
  value: Dayjs | null;
  onChange: (nextDate: Dayjs | null) => void;
  availableDates: string[];
  isLoading?: boolean;
  disableWhenNoAvailability?: boolean;
}

type CalendarView = 'year' | 'month' | 'day';

const defaultCalendarViews: readonly CalendarView[] = ['year', 'month', 'day'] as const;

const resolveLargestView = (views: readonly CalendarView[]): CalendarView => {
  if (views.includes('year')) return 'year';
  if (views.includes('month')) return 'month';
  return 'day';
};

const useDateDisableRules = (type: string) => {
  const disableYear = ['landsat', 'monthlyAvg', 'groundData', 'chlorophyll'].includes(type);
  const disableMonth = [
    'landsat',
    'monthlyAvg',
    'monthlyAvgManyYears',
    'groundData',
    'chlorophyll',
  ].includes(type);
  const disableDay = ['landsat', 'groundData'].includes(type);

  return { disableYear, disableMonth, disableDay };
};

export const AvailabilityDatePicker = ({
  type,
  label,
  value,
  onChange,
  availableDates,
  isLoading = false,
  disableWhenNoAvailability = true,
  disabled,
  minDate,
  maxDate,
  views,
  format,
  slotProps: incomingSlotProps,
  ...props
}: AvailabilityDatePickerProps) => {
  const { disableDay, disableMonth, disableYear } = useDateDisableRules(type);

  const availability = useMemo(
    () => buildCalendarAvailability(type, availableDates),
    [availableDates, type],
  );

  const pickerKey = useMemo(
    () =>
      `${type}-${availability.items.length}-${availability.minDate?.valueOf() ?? 'none'}-${
        availability.maxDate?.valueOf() ?? 'none'
      }`,
    [availability.items.length, availability.maxDate, availability.minDate, type],
  );

  const referenceDate = value ?? availability.maxDate ?? dayjs();
  const resolvedMinDate = minDate ?? availability.minDate ?? dayjs('1990-01-01');
  const resolvedMaxDate = maxDate ?? availability.maxDate ?? dayjs(`${dayjs().year()}-12-31`);
  const resolvedViews = useMemo<readonly CalendarView[]>(
    () =>
      views && views.length
        ? (views.filter(
            (view): view is CalendarView =>
              view === 'year' || view === 'month' || view === 'day',
          ) as readonly CalendarView[])
        : defaultCalendarViews,
    [views],
  );
  const resolvedOpenTo = useMemo<CalendarView>(
    () => resolveLargestView(resolvedViews),
    [resolvedViews],
  );

  const isDisabled =
    Boolean(disabled) ||
    isLoading ||
    (disableWhenNoAvailability && type !== 'groundData' && availability.items.length === 0);

  const availableButtonStyle = {
    border: '1px solid #8fb2df !important',
    background:
      'linear-gradient(145deg, rgba(39, 106, 189, 0.16), rgba(19, 73, 145, 0.13)) !important',
    color: '#1f4c86 !important',
    fontWeight: 800,
    boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.3)',
  };

  const disabledButtonStyle = {
    border: '1px solid rgba(196, 210, 231, 0.65)',
    background: 'rgba(242, 246, 251, 0.86)',
    color: 'rgba(103, 125, 148, 0.52)',
    opacity: 0.72,
  };

  const availableDayStyle = {
    border: '1px solid #8fb2df !important',
    background: 'rgba(36, 95, 176, 0.12) !important',
    color: '#1f4c86 !important',
    fontWeight: 700,
  };

  const pickerPaperSx = {
    '& .MuiYearCalendar-button:not(.Mui-disabled)': availableButtonStyle,
    '& .MuiYearCalendar-button.MuiYearCalendar-selected': availableButtonStyle,
    '& .MuiYearCalendar-button.Mui-selected': availableButtonStyle,
    '& .MuiYearCalendar-button.Mui-disabled': disabledButtonStyle,

    '& .MuiMonthCalendar-button:not(.Mui-disabled)': availableButtonStyle,
    '& .MuiMonthCalendar-button.MuiMonthCalendar-selected': availableButtonStyle,
    '& .MuiMonthCalendar-button.Mui-selected': availableButtonStyle,
    '& .MuiMonthCalendar-button.Mui-disabled': disabledButtonStyle,

    '& .MuiPickersDay-root:not(.Mui-disabled)': availableDayStyle,
    '& .MuiPickersDay-root.Mui-selected': availableDayStyle,
    '& .MuiPickersDay-root.Mui-selected:hover': availableDayStyle,
    '& .MuiPickersDay-root.Mui-selected:focus': availableDayStyle,
    '& .MuiPickersDay-root.Mui-disabled': {
      color: 'rgba(103, 125, 148, 0.52)',
      opacity: 0.68,
      borderColor: 'rgba(214, 224, 238, 0.6)',
    },
    '& .MuiPickersDay-today:not(.Mui-disabled)': {
      border: '1px solid #8fb2df',
    },
  } as const;

  const textFieldSlot = (incomingSlotProps?.textField ?? {}) as Record<string, unknown>;
  const textFieldInputProps = (textFieldSlot.inputProps ?? {}) as Record<string, unknown>;

  const desktopPaperSlot = (incomingSlotProps?.desktopPaper ?? {}) as Record<string, unknown>;
  const desktopPaperSx = desktopPaperSlot.sx;

  const mobilePaperSlot = (incomingSlotProps?.mobilePaper ?? {}) as Record<string, unknown>;
  const mobilePaperSx = mobilePaperSlot.sx;

  return (
    <DatePicker
      key={pickerKey}
      {...props}
      disabled={isDisabled}
      label={label}
      views={resolvedViews}
      openTo={resolvedOpenTo}
      yearsOrder="desc"
      format={format}
      referenceDate={referenceDate}
      value={value}
      onChange={(nextDate) => {
        onChange(nextDate ?? null);
      }}
      slotProps={{
        ...incomingSlotProps,
        textField: {
          ...textFieldSlot,
          size: 'small',
          fullWidth: true,
          inputProps: {
            ...textFieldInputProps,
            draggable: false,
            onDragStart: (event: DragEvent<HTMLInputElement>) => event.preventDefault(),
            onDrop: (event: DragEvent<HTMLInputElement>) => event.preventDefault(),
            onDragOver: (event: DragEvent<HTMLInputElement>) => event.preventDefault(),
          },
        },
        desktopPaper: {
          ...desktopPaperSlot,
          sx: desktopPaperSx ? [pickerPaperSx, desktopPaperSx] : pickerPaperSx,
        },
        mobilePaper: {
          ...mobilePaperSlot,
          sx: mobilePaperSx ? [pickerPaperSx, mobilePaperSx] : pickerPaperSx,
        },
      }}
      shouldDisableYear={(date) =>
        disableYear && availability.years.size > 0 && !availability.years.has(date.year())
      }
      shouldDisableMonth={(date) => {
        if (!disableMonth || availability.months.size === 0) {
          return false;
        }

        const month = date.month() + 1;
        const monthsOfYear = availability.monthsByYear.get(date.year());

        if (monthsOfYear && monthsOfYear.size > 0) {
          return !monthsOfYear.has(month);
        }

        return !availability.months.has(month);
      }}
      shouldDisableDate={(date) => {
        if (!disableDay || availability.days.size === 0) {
          return false;
        }

        const next = toApiDate(date);
        return Boolean(next && !availability.days.has(next));
      }}
      minDate={resolvedMinDate}
      maxDate={resolvedMaxDate}
    />
  );
};
