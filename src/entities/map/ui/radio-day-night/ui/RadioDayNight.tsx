import { RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { getTileOptionByKey } from '../../../model/selectors';
import { mapActions } from '../../../model/slices';
import * as s from './RadioDayNight.module.scss';

const RadioDayNight: React.FC = () => {
	const dispatch = useAppDispatch();
	const selectedRadio = useAppSelector(getTileOptionByKey('photoTime'));

	const onValueChange = (_: unknown, value: string) => {
		dispatch(mapActions.setTileOptions({ key: 'photoTime', value }));
	};

	return (
		<div className={s.radio_group}>
			<RadioGroup value={selectedRadio} onChange={onValueChange}>
				<FormControlLabel value="daily" control={<Radio />} label="дневные" />
				<FormControlLabel value="nigthly" control={<Radio />} label="ночные" />
				<FormControlLabel value="diurnal" control={<Radio />} label="суточные" />
			</RadioGroup>
		</div>
	);
};

export { RadioDayNight };
