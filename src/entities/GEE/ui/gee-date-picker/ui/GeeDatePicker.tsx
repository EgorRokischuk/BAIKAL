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
	const dateStart = useAppSelector(getGeeDateByKey('dateStart'));
	const dateEnd = useAppSelector(getGeeDateByKey('dateEnd'));

	const minDate = dateKey === 'dateEnd' && dateStart ? dateStart : dayjs('1990-01-01');
	const maxDate = dateKey === 'dateStart' && dateEnd ? dateEnd : dayjs();

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
			<DatePicker
				{...props}
				disabled={isLoading}
				value={date ? dayjs(date, 'DD.MM.YYYY') : null}
				onChange={(nextDate) => {
					dispatch(geeActions.setDate({ key: dateKey, value: nextDate }));
				}}
				slotProps={{
					textField: {
						sx: {
							'& .MuiInputBase-input': {
								fontSize: '16px',
							},
						},
						inputProps: {
							draggable: false,
							onDragStart: (event) => event.preventDefault(),
							onDrop: (event) => event.preventDefault(),
							onDragOver: (event) => event.preventDefault(),
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
				minDate={minDate}
				maxDate={maxDate}
			/>
		</LocalizationProvider>
	);
};

export { GeeDatePicker };
