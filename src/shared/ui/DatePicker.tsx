import { DatePickerProps, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

interface ITileDatePickerProps extends DatePickerProps<Dayjs, false> {}

export const DatePicker: React.FC<ITileDatePickerProps> = (props) => {
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
			<DatePicker {...props} />
		</LocalizationProvider>
	);
};
