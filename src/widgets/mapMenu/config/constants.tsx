import { TabMenu, Accordions, RadioDayNight } from '@/entities/map';
import type { IMapMenu, IMapMenuContent } from '@/entities/map';
import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	FormControlLabel,
	Checkbox,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

// Содержимое таба "Наземные данные"
const groundDataContent: IMapMenuContent = (
	<>
		<Accordion>
			<AccordionSummary>Тип данных</AccordionSummary>
			<AccordionDetails>
				<FormControlLabel control={<Checkbox />} label="Хлорофил" />
				<FormControlLabel control={<Checkbox />} label="Осадки" />
				<FormControlLabel control={<Checkbox />} label="Температура" />
			</AccordionDetails>
		</Accordion>
		<Accordion>
			<AccordionSummary>Источники данных</AccordionSummary>
			<AccordionDetails>
				<FormControlLabel control={<Checkbox />} label="Томск" />
				<FormControlLabel control={<Checkbox />} label="Севастополь" />
			</AccordionDetails>
		</Accordion>
		<Accordion>
			<AccordionSummary>Выбор даты</AccordionSummary>
			<AccordionDetails>
				<DatePicker label="день" />
			</AccordionDetails>
		</Accordion>
	</>
);

// Содержимое таба "Озеро Байкал - LST - LANDSAT"
const landsatTabs: IMapMenu = [
	{
		title: '4',
		level: 2,
		value: '4',
		content: <DatePicker label="день" />,
	},
	{
		title: '5',
		level: 2,
		value: '5',
		content: <DatePicker label="день" />,
	},
	{
		title: '6',
		level: 2,
		value: '6',
		content: <DatePicker label="день" />,
	},
	{
		title: '7',
		level: 2,
		value: '7',
		content: <DatePicker label="день" />,
	},
	{
		title: '8',
		level: 2,
		value: '8',
		content: <DatePicker label="день" />,
	},
];

// Содержимое таба "Озеро Байкал - LST"
const lstSatellites: IMapMenu = [
	{
		title: 'VIIRS',
		value: 'viirs',
		level: 1,
		content: <Accordions />,
	},
	{
		title: 'MODIS Terra',
		value: 'terra',
		level: 1,
		content: (
			<>
				<RadioDayNight />
				<Accordions />
			</>
		),
	},
	{
		title: 'MODIS Aqua',
		value: 'aqua',
		level: 1,
		content: (
			<>
				<RadioDayNight />
				<Accordions />
			</>
		),
	},
	{
		title: 'LANDSAT',
		value: 'landsat',
		level: 1,
		content: <TabMenu tabs={landsatTabs} />,
	},
];

// Содержимое таба "Озеро Байкал"
const baikalRiverTabs: IMapMenu = [
	{
		title: 'LST',
		value: 'temperature',
		level: 0,
		content: <TabMenu tabs={lstSatellites} />,
	},
	{
		title: 'Хлорофилл',
		value: 'chlorophyll',
		level: 0,
		content: null,
	},
	{
		title: 'Прозрачность',
		value: 'transparency',
		level: 0,
		content: null,
	},
];

// Структура меню карты
export const MENU_STRUCTURE: IMapMenu = [
	{
		title: 'Озеро Байкал',
		level: -1,
		content: <TabMenu tabs={baikalRiverTabs} />,
	},
	{
		title: 'Байкальская природная территория',
		level: -1,
		content: null,
	},
	{
		title: 'Наземные данные',
		level: -1,
		content: groundDataContent,
	},
];
