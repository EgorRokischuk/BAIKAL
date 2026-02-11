import { DatePicker, DatePickerProps, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { convertToDateInput } from '@/shared/lib/datetimeFormat';
import { getGroundDataOptions, getMapDateByKey } from '../../../model/selectors';
import { mapActions } from '../../../model/slices';
import 'dayjs/locale/ru';
import { useDateHelper, useGetAvailableDate } from '../lib/helpers';
dayjs.locale('ru');
import './TileDatePicker.css';

interface ITileDatePickerProps extends DatePickerProps<Dayjs, false> {
	type: string;
	dateKey?: 'startDate' | 'endDate';
}

const TileDatePicker: React.FC<ITileDatePickerProps> = ({
	type,
	dateKey = 'startDate',
	views: propViews,
	openTo: propOpenTo,
	format: propFormat,
	label: labelProp,
	slotProps: slotPropsProp,
	...props
}) => {
	const dispatch = useAppDispatch();
	const date = useAppSelector(getMapDateByKey(dateKey));
	const groundDataOptions = useAppSelector(getGroundDataOptions);

        const { isShouldDisableYear, isShouldDisableMonth, isShouldDisableDay } = useDateHelper(type);
        const { data, isLoading } = useGetAvailableDate(type);
        const isMonthOnly = type === 'chlorophyll';
	const disableFloatingLabel = type === 'monthlyAvg' || type === 'monthlyAvgManyYears';

        const isDisabled = isLoading || (type !== 'groundData' && !(data || []).length);
	const groundStartDate = groundDataOptions.startDate ? dayjs(groundDataOptions.startDate) : null;
	const groundEndDate = groundDataOptions.endDate ? dayjs(groundDataOptions.endDate) : null;
	const resolvedViews = propViews ?? (isMonthOnly ? ['year', 'month'] : undefined);
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
				: resolvedViews.includes('year') && resolvedViews.includes('month') && resolvedViews.length === 2
					? 'MM.YYYY'
					: undefined
			: undefined);
	const placeholderLabel =
		disableFloatingLabel && typeof labelProp === 'string' ? labelProp : undefined;
	const preventDrag = type === 'groundData';

        return (
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                        <DatePicker
                                {...props}
                                disabled={isDisabled}
				views={resolvedViews}
				openTo={resolvedOpenTo}
				format={resolvedFormat}
				label={disableFloatingLabel ? undefined : labelProp}
				value={date ? dayjs(date, 'DD.MM.YYYY') : null}
				onChange={(date) => {
					dispatch(mapActions.setMapDate({ key: dateKey, value: date }));
				}}
				slotProps={{
					...slotPropsProp,
					textField: {
						...(slotPropsProp?.textField ?? {}),
						placeholder: placeholderLabel ?? slotPropsProp?.textField?.placeholder,
						InputLabelProps: {
							...(slotPropsProp?.textField?.InputLabelProps ?? {}),
							shrink: disableFloatingLabel ? false : slotPropsProp?.textField?.InputLabelProps?.shrink,
						},
						inputProps: {
							...(slotPropsProp?.textField?.inputProps ?? {}),
							draggable: preventDrag ? false : slotPropsProp?.textField?.inputProps?.draggable,
							onDragStart: preventDrag
								? (event) => event.preventDefault()
								: slotPropsProp?.textField?.inputProps?.onDragStart,
							onDrop: preventDrag
								? (event) => event.preventDefault()
								: slotPropsProp?.textField?.inputProps?.onDrop,
							onDragOver: preventDrag
								? (event) => event.preventDefault()
								: slotPropsProp?.textField?.inputProps?.onDragOver,
						},
						sx: {
							'& .MuiInputBase-input': {
								fontSize: '16px',
							},
							...(slotPropsProp?.textField?.sx ?? {}),
						},
					},
					desktopPaper: {
						...(slotPropsProp?.desktopPaper ?? {}),
						sx: {
							'& .MuiPickersDay-root': {
								fontSize: '15px',
								height: '40px',
								width: '40px',
							},
							...(slotPropsProp?.desktopPaper?.sx ?? {}),
						},
					},
				}}
				shouldDisableYear={(v) =>
					isShouldDisableYear && !(data ?? []).map((v) => Number(v.slice(0, 4))).includes(v.year())
				}
				shouldDisableMonth={(v) =>
					isShouldDisableMonth &&
					!(data ?? []).map((v) => Number(v.length < 3 ? v : v.slice(5, 7))).includes(v.month() + 1)
				}
				shouldDisableDate={(v) =>
					isShouldDisableDay && !(data ?? []).includes(convertToDateInput(v))
				}
				minDate={
					type === 'groundData' && dateKey === 'endDate' && groundStartDate
						? groundStartDate
						: dayjs((data ?? [])[0] ?? '1990-01-01')
				}
				maxDate={
					type === 'groundData' && dateKey === 'startDate' && groundEndDate
						? groundEndDate
						: dayjs(`${dayjs(Date.now()).year()}-12-31`)
				}
			/>
		</LocalizationProvider>
	);
};

export { TileDatePicker };
