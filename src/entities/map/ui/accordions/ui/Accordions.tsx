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

	const accordionSx = {
		boxShadow: 'none',
		margin: 0,
		'&.Mui-expanded': {
			margin: 0,
		},
		'&:before': {
			display: 'none',
		},
	};

	const summarySx = {
		minHeight: 32,
		padding: '0 8px',
		justifyContent: 'center',
		borderTop: '1px solid #d6dbe6',
		borderBottom: '1px solid #d6dbe6',
		'&.Mui-expanded': {
			minHeight: 32,
		},
		'& .MuiAccordionSummary-content': {
			margin: '6px 0',
			width: '100%',
			justifyContent: 'center',
			textAlign: 'center',
		},
		'& .MuiAccordionSummary-content.Mui-expanded': {
			margin: '6px 0',
		},
	};

	const detailsSx = {
		padding: '0 8px 8px',
	};

	return (
		<>
			<Accordion
				disableGutters
				sx={accordionSx}
				disabled={!photoTime}
				expanded={expanded === 'monthlyAvg'}
				onChange={makeChangeHandler('monthlyAvg')}
			>
				<AccordionSummary sx={summarySx}>
					<Typography>{'Среднемесячные'}</Typography>
				</AccordionSummary>
				<AccordionDetails sx={detailsSx}>
					<TileDatePicker type="monthlyAvg" views={['year', 'month']} label="Месяц и год" />
				</AccordionDetails>
			</Accordion>
			<Accordion
				disableGutters
				sx={accordionSx}
				disabled={!photoTime}
				expanded={expanded === 'monthlyAvgManyYears'}
				onChange={makeChangeHandler('monthlyAvgManyYears')}
			>
				<AccordionSummary sx={summarySx}>
					<Typography>{'Многолетние'}</Typography>
				</AccordionSummary>
				<AccordionDetails sx={detailsSx}>
					<TileDatePicker type="monthlyAvgManyYears" views={['month']} label="Месяц" />
				</AccordionDetails>
			</Accordion>
		</>
	);
};

export { Accordions };
