import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { getTileDate } from '@/entities/Map/model/selectors';
import { mapActions } from '@/entities/Map/model/slices';
import { DatePicker, DatePickerProps, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ru';
dayjs.locale('ru');

const TileDatePicker: React.FC<DatePickerProps<Dayjs, false>> = (props) => {
	const date = useAppSelector(getTileDate);
	const dispatch = useAppDispatch();

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
			<DatePicker
				{...props}
				label="День"
				value={!!date ? dayjs(date, 'DD_MM_YY') : null}
				onChange={(date) => dispatch(mapActions.setDate(date ? date.toISOString() : null))}
				slotProps={{
					textField: {
						sx: {
							'& .MuiInputBase-input': {
								fontSize: '16px', // Размер текста в поле ввода
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
			/>
		</LocalizationProvider>
	);
};

export { TileDatePicker };
