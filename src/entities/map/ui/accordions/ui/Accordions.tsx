import { Accordion, AccordionSummary, Typography, AccordionDetails } from '@mui/material';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { getTileOptionByKey } from '../../../model/selectors';
import { mapActions } from '../../../model/slices';
import { TileDatePicker } from '../../tile-date-picker';

const Accordions: React.FC = () => {
	const dispatch = useAppDispatch();

	const expanded = useAppSelector(getTileOptionByKey('type'));
	const photoTime = useAppSelector(getTileOptionByKey('photoTime'));

	const makeChangeHandler = (panel: string) => (_: unknown, isExpanded: boolean) => {
		dispatch(mapActions.setTileOptions({ key: 'type', value: isExpanded ? panel : null }));
	};

	return (
		<>
			<Accordion
				disabled={!photoTime}
				expanded={expanded === 'monthlyAvg'}
				onChange={makeChangeHandler('monthlyAvg')}
			>
				<AccordionSummary>
					<Typography>{'Средние за год'}</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<TileDatePicker type="monthlyAvg" views={['year', 'month']} label="Месяц и год" />
				</AccordionDetails>
			</Accordion>
			<Accordion
				disabled={!photoTime}
				expanded={expanded === 'monthlyAvgManyYears'}
				onChange={makeChangeHandler('monthlyAvgManyYears')}
			>
				<AccordionSummary>
					<Typography>{'Среднемесячные'}</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<TileDatePicker type="monthlyAvgManyYears" views={['month']} label="Месяц" />
				</AccordionDetails>
			</Accordion>
		</>
	);
};

export { Accordions };
