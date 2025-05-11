import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useState } from 'react';
import { SelectGroundDataParameter } from '@/features/Map/ground-data-select-parameter';
import { SelectGroundDataSource } from '@/features/Map/ground-data-select-source';
import type { IMapMenu, IMapMenuContent } from '@/entities/Map';
import { TabMenu, Accordions, RadioDayNight } from '@/entities/Map';
import { TileDatePicker } from '@/entities/Map';

// Содержимое таба "Наземные данные"
const groundDataContent: IMapMenuContent = () => {
	const [panel, setPanel] = useState<string>('date');

	const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
		setPanel(isExpanded ? panel : '');
	};

	return (
		<>
			<Accordion expanded={panel === 'date'} onChange={handleChange('date')}>
				<AccordionSummary>{'Выбор даты'}</AccordionSummary>
				<AccordionDetails>
					<TileDatePicker />
					<TileDatePicker dateKey="endDate" />
				</AccordionDetails>
			</Accordion>
			<SelectGroundDataParameter
				expanded={panel === 'parameter'}
				onChange={handleChange('parameter')}
			/>
			<SelectGroundDataSource expanded={panel === 'source'} onChange={handleChange('source')} />
		</>
	);
};

// Содержимое таба "Озеро Байкал - LST - LANDSAT"
const landsatTabs: IMapMenu = [
	{
		title: '4',
		key: 'source',
		value: 'landsat',
		content: () => <TileDatePicker />,
	},
	{
		title: '5',
		key: 'source',
		value: 'landsat',
		content: () => <TileDatePicker />,
	},
	{
		title: '6',
		key: 'source',
		value: 'landsat',
		content: () => <TileDatePicker />,
	},
	{
		title: '7',
		key: 'source',
		value: 'landsat',
		content: () => <TileDatePicker />,
	},
	{
		title: '8',
		key: 'source',
		value: 'landsat',
		content: () => <TileDatePicker />,
	},
];

// Содержимое таба "Озеро Байкал - LST"
const lstSatellites: IMapMenu = [
	{
		title: 'VIIRS',
		key: 'source',
		value: 'viirs',
		content: () => (
			<>
				<RadioDayNight />
				<Accordions />
			</>
		),
	},
	{
		title: 'MODIS Terra',
		key: 'source',
		value: 'terra',
		content: () => (
			<>
				<RadioDayNight />
				<Accordions />
			</>
		),
	},
	{
		title: 'MODIS Aqua',
		key: 'source',
		value: 'aqua',
		content: () => (
			<>
				<RadioDayNight />
				<Accordions />
			</>
		),
	},
	{
		title: 'LANDSAT',
		key: 'source',
		value: 'landsat',
		content: () => <TabMenu tabs={landsatTabs} />,
	},
];

// Содержимое таба "Озеро Байкал"
const baikalRiverTabs: IMapMenu = [
	{
		title: 'LST',
		key: 'parameter',
		value: 'temperature',
		content: () => <TabMenu tabs={lstSatellites} />,
	},
	{
		title: 'Хлорофилл',
		key: 'parameter',
		value: 'chlorophyll',
		content: () => <></>,
	},
	{
		title: 'Прозрачность',
		key: 'parameter',
		value: 'transparency',
		content: () => <></>,
	},
];

// Структура меню карты
export const MENU_STRUCTURE: IMapMenu = [
	{
		title: 'Озеро Байкал',
		key: 'productType',
		value: 'baikalRiver',
		content: () => <TabMenu tabs={baikalRiverTabs} />,
	},
	{
		title: 'Байкальская природная территория',
		key: 'productType',
		value: 'baikalNature',
		content: () => <></>,
	},
	{
		title: 'Наземные данные',
		key: 'productType',
		value: 'groundData',
		content: groundDataContent,
	},
];
