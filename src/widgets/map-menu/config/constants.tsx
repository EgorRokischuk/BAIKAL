import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	FormControlLabel,
	Checkbox,
} from '@mui/material';
import type { IMapMenu, IMapMenuContent } from '@/entities/Map';
import { TabMenu, Accordions, RadioDayNight } from '@/entities/Map';
import { TileDatePicker } from '@/entities/Map';

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
const landsatTabs: IMapMenu = [
	{
		title: '4',
		key: 'device',
		value: 'landsat',
		content: <TileDatePicker />,
	},
	{
		title: '5',
		key: 'device',
		value: 'landsat',
		content: <TileDatePicker />,
	},
	{
		title: '6',
		key: 'device',
		value: 'landsat',
		content: <TileDatePicker />,
	},
	{
		title: '7',
		key: 'device',
		value: 'landsat',
		content: <TileDatePicker />,
	},
	{
		title: '8',
		key: 'device',
		value: 'landsat',
		content: <TileDatePicker />,
	},
];

// Содержимое таба "Озеро Байкал - LST"
const lstSatellites: IMapMenu = [
	{
		title: 'VIIRS',
		key: 'device',
		value: 'viirs',
		content: <Accordions />,
	},
	{
		title: 'MODIS Terra',
		key: 'device',
		value: 'terra',
		content: (
			<>
				<RadioDayNight />
				<Accordions />
			</>
		),
	},
	{
		title: 'MODIS Aqua',
		key: 'device',
		value: 'aqua',
		content: (
			<>
				<RadioDayNight />
				<Accordions />
			</>
		),
	},
	{
		title: 'LANDSAT',
		key: 'device',
		value: 'landsat',
		content: <TabMenu tabs={landsatTabs} />,
	},
];

// Содержимое таба "Озеро Байкал"
const baikalRiverTabs: IMapMenu = [
	{
		title: 'LST',
		key: 'parameter',
		value: 'temperature',
		content: <TabMenu tabs={lstSatellites} />,
	},
	{
		title: 'Хлорофилл',
		key: 'parameter',
		value: 'chlorophyll',
		content: null,
	},
	{
		title: 'Прозрачность',
		key: 'parameter',
		value: 'transparency',
		content: null,
	},
];

// Структура меню карты
export const MENU_STRUCTURE: IMapMenu = [
	{
		title: 'Озеро Байкал',
		key: 'type',
		value: 'baikalRiver',
		content: <TabMenu tabs={baikalRiverTabs} />,
	},
	{
		title: 'Байкальская природная территория',
		key: 'type',
		value: 'baikalNature',
		content: null,
	},
	{
		title: 'Наземные данные',
		key: 'type',
		value: 'groundData',
		content: groundDataContent,
	},
];
