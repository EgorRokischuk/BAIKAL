import { RadioGroup, FormControlLabel, Radio } from '@mui/material';
import * as s from './RadioDayNight.module.scss';

const RadioDayNight: React.FC = () => (
	<div className={s.radio_group}>
		<RadioGroup>
			<FormControlLabel value="daily" control={<Radio />} label="дневные" />
			<FormControlLabel value="nigthly" control={<Radio />} label="ночные" />
		</RadioGroup>
	</div>
);

export { RadioDayNight };
