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
	...props
}) => {
	const dispatch = useAppDispatch();
	const date = useAppSelector(getMapDateByKey(dateKey));
	const groundDataOptions = useAppSelector(getGroundDataOptions);

	const { isShouldDisableYear, isShouldDisableMonth, isShouldDisableDay } = useDateHelper(type);
	const { data, isLoading } = useGetAvailableDate(type);

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
			<DatePicker
				{...props}
				disabled={isLoading || (type !== 'groundData' && !(data || []).length)}
				value={date ? dayjs(date, 'DD.MM.YYYY') : null}
				onChange={(date) => {
					dispatch(mapActions.setMapDate({ key: dateKey, value: date }));
				}}
				slotProps={{
					textField: {
						sx: {
							'& .MuiInputBase-input': {
								fontSize: '16px',
							},
						},
					},
					desktopPaper: {
						sx: {
							'& .MuiPickersDay-root': {
								fontSize: '15px',
								height: '40px',
								width: '40px',
							},
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
				minDate={type === 'groundData' ? dayjs(groundDataOptions.startDate) : dayjs('1990-01-01')}
				maxDate={dayjs(`${dayjs(Date.now()).year()}-12-31`)}
			/>
		</LocalizationProvider>
	);
};

export { TileDatePicker };
