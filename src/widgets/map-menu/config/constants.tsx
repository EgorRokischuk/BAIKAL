import { TabMenu, Accordions, RadioDayNight, getTileDate, mapActions } from '@/entities/Map';
import type { IMapMenu, IMapMenuContent } from '@/entities/Map';
import { TileDatePicker } from '@/entities/Map';
import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	FormControlLabel,
	Checkbox,
} from '@mui/material';

// Содержимое таба "Наземные данные"
const groundDataContent: IMapMenuContent = (
	<>
		<Accordion>
			<AccordionSummary>{'Тип данных'}</AccordionSummary>
			<AccordionDetails>
				<FormControlLabel control={<Checkbox />} label="Хлорофил" />
				<FormControlLabel control={<Checkbox />} label="Осадки" />
				<FormControlLabel control={<Checkbox />} label="Температура" />
			</AccordionDetails>
		</Accordion>
		<Accordion>
			<AccordionSummary>{'Источники данных'}</AccordionSummary>
			<AccordionDetails>
				<FormControlLabel control={<Checkbox />} label="Томск" />
				<FormControlLabel control={<Checkbox />} label="Севастополь" />
			</AccordionDetails>
		</Accordion>
		<Accordion>
			<AccordionSummary>{'Выбор даты'}</AccordionSummary>
			<AccordionDetails>
				<TileDatePicker />
			</AccordionDetails>
		</Accordion>
	</>
);

// Содержимое таба "Озеро Байкал - LST - LANDSAT"
const landsatTabs = [
	{
		title: '4',
		level: 2,
		value: 'Landsat_4',
		content: <TileDatePicker />,
	},
	{
		title: '5',
		level: 2,
		value: 'Landsat_5',
		content: <TileDatePicker />,
	},
	{
		title: '6',
		level: 2,
		value: 'Landsat_6',
		content: <TileDatePicker />,
	},
	{
		title: '7',
		level: 2,
		value: 'Landsat_7',
		content: <TileDatePicker />,
	},
	{
		title: '8',
		level: 2,
		value: 'Landsat_8',
		content: <TileDatePicker />,
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
