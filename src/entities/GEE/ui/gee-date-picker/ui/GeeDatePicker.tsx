import { DatePicker, DatePickerProps, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { getGeeDateByKey } from '../../../model/selectors';
import { geeActions } from '../../../model/slices';
import 'dayjs/locale/ru';
dayjs.locale('ru');

interface ITileDatePickerProps extends DatePickerProps<Dayjs, false> {
	dateKey?: 'dateStart' | 'dateEnd';
}

const GeeDatePicker: React.FC<ITileDatePickerProps> = ({ dateKey = 'dateStart', ...props }) => {
	const dispatch = useAppDispatch();
	const isLoading = useAppSelector(({ global }) => global.isLoading);
	const date = useAppSelector(getGeeDateByKey(dateKey));

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
			<DatePicker
				{...props}
				disabled={isLoading}
				value={date ? dayjs(date, 'DD.MM.YYYY') : null}
				onChange={(date) => {
					dispatch(geeActions.setDate({ key: dateKey, value: date }));
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
				minDate={dayjs('1990-01-01')}
				maxDate={dayjs(Date.now())}
			/>
		</LocalizationProvider>
	);
};

export { GeeDatePicker };
