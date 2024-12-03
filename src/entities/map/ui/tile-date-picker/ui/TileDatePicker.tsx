import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { getTileDate } from '@/entities/map/model/selectors';
import { mapActions } from '@/entities/map/model/slices';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

const TileDatePicker = (props: DatePickerProps<Dayjs, false>) => {
	const date = useAppSelector(getTileDate);
	const dispatch = useAppDispatch();

	return (
		<DatePicker
			{...props}
			label="День"
			value={!!date ? dayjs(date, 'DD_MM_YY') : null}
			onChange={(date) => dispatch(mapActions.setDate(date.toISOString()))}
		/>
	);
};

export { TileDatePicker };
