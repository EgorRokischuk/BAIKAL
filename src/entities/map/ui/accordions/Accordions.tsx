import { Accordion, AccordionSummary, Typography, AccordionDetails } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';

// TODO: replace "any"
const Accordions = () => {
	const [expanded, setExpanded] = useState<any>(false);

	const makeChangeHandler = (panel: any) => (event: any, isExpanded: any) => {
		setExpanded(isExpanded ? panel : false);
	};

	return (
		<>
			<Accordion expanded={expanded === 'panel1'} onChange={makeChangeHandler('panel1')}>
				<AccordionSummary>
					<Typography>Средние ежегодные</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<DatePicker views={['year', 'month']} label="Месяц и год" />
				</AccordionDetails>
			</Accordion>
			<Accordion expanded={expanded === 'panel2'} onChange={makeChangeHandler('panel2')}>
				<AccordionSummary>
					<Typography>Многолетние среднемесячные</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<DatePicker views={['month']} label="Месяц" />
				</AccordionDetails>
			</Accordion>
		</>
	);
};

export { Accordions };
