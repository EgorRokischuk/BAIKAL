import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	RadioGroup,
	FormControlLabel,
	Radio,
	Box,
} from '@mui/material';
import { useState } from 'react';
import { SelectGroundDataParameter } from '@/features/Map/ground-data-select-parameter';
import { SelectGroundDataSource } from '@/features/Map/ground-data-select-source';
import { geeActions, GeeDatePicker, getGeeType } from '@/entities/GEE';
import type { IMapMenu, IMapMenuContent } from '@/entities/Map';
import { TabMenu, Accordions, RadioDayNight } from '@/entities/Map';
import { TileDatePicker } from '@/entities/Map';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';

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
					<TileDatePicker type="groundData" />
					<TileDatePicker type="groundData" dateKey="endDate" />
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

// Содержимое таба "Онлайн продукты"
const onlineProductsContent: React.FC = () => {
	const dispatch = useAppDispatch();
	const selectedRadio = useAppSelector(getGeeType);

	const onValueChange = (_: unknown, value: string) => {
		dispatch(geeActions.setGeeType(value));
	};

	return (
		<>
			<Box padding={1}>
				<RadioGroup value={selectedRadio} onChange={onValueChange}>
					<FormControlLabel value="polygon" control={<Radio />} label="Полигон" />
					<FormControlLabel value="point" control={<Radio />} label="Точка" />
				</RadioGroup>
			</Box>

			<Box padding={1}>
				<GeeDatePicker />
				<GeeDatePicker dateKey="dateEnd" />
			</Box>
		</>
	);
};

// Содержимое таба "Озеро Байкал - LST - LANDSAT"
const landsatTabs: IMapMenu = [
	{
		title: '4',
		key: 'source',
		value: 'landsat',
		content: () => <TileDatePicker type="landsat" />,
	},
	{
		title: '5',
		key: 'source',
		value: 'landsat',
		content: () => <TileDatePicker type="landsat" />,
	},
	{
		title: '6',
		key: 'source',
		value: 'landsat',
		content: () => <TileDatePicker type="landsat" />,
	},
	{
		title: '7',
		key: 'source',
		value: 'landsat',
		content: () => <TileDatePicker type="landsat" />,
	},
	{
		title: '8',
		key: 'source',
		value: 'landsat',
		content: () => <TileDatePicker type="landsat" />,
	},
	{
		title: '9',
		key: 'source',
		value: 'landsat',
		content: () => <TileDatePicker type="landsat" />,
	},
];

// Содержимое таба "Озеро Байкал - LST"
const lstSatellites: IMapMenu = [
	{
		title: 'VIIRS/NPP',
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
		title: 'MODIS/Terra',
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
		title: 'MODIS/Aqua',
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
		title: 'Landsat',
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
		title: 'Готовые продукты',
		key: 'productType',
		value: 'baikalRiver',
		content: () => <TabMenu tabs={baikalRiverTabs} />,
	},
	{
		title: 'Онлайн продукты',
		key: 'productType',
		value: 'gee',
		content: onlineProductsContent,
	},
	{
		title: 'Наземные данные',
		key: 'productType',
		value: 'groundData',
		content: groundDataContent,
	},
];
