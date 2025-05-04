import { DatePicker, DatePickerProps, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { getTileOptionByKey } from '../../../model/selectors';
import { mapActions } from '../../../model/slices';
import 'dayjs/locale/ru';
dayjs.locale('ru');

const TileDatePicker: React.FC<DatePickerProps<Dayjs, false>> = (props) => {
	const date = useAppSelector(getTileOptionByKey('date'));
	const dispatch = useAppDispatch();

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
			<DatePicker
				{...props}
				value={date ? dayjs(date, 'DD.MM.YYYY') : null}
				onChange={(date) => dispatch(mapActions.setTileDate(date))}
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
