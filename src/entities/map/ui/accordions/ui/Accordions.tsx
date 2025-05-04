import { Accordion, AccordionSummary, Typography, AccordionDetails } from '@mui/material';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { getTileOptionByKey } from '../../../model/selectors';
import { mapActions } from '../../../model/slices';
import { TileDatePicker } from '../../tile-date-picker';

const Accordions: React.FC = () => {
	const dispatch = useAppDispatch();

	const expanded = useAppSelector(getTileOptionByKey('photoType'));

	const makeChangeHandler = (panel: string) => (_: unknown, isExpanded: boolean) => {
		dispatch(mapActions.setTileOptions({ key: 'photoType', value: isExpanded ? panel : null }));
	};

	return (
		<>
			<Accordion expanded={expanded === 'avgYear'} onChange={makeChangeHandler('avgYear')}>
				<AccordionSummary>
					<Typography>{'Средние ежегодные'}</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<TileDatePicker views={['year', 'month']} label="Месяц и год" />
				</AccordionDetails>
			</Accordion>
			<Accordion expanded={expanded === 'avgMonth'} onChange={makeChangeHandler('avgMonth')}>
				<AccordionSummary>
					<Typography>{'Многолетние среднемесячные'}</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<TileDatePicker views={['month']} label="Месяц" />
				</AccordionDetails>
			</Accordion>
		</>
	);
};

export { Accordions };
