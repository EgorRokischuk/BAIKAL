import { IExportHeaderItem } from '@/shared/types';

export const headers: Array<IExportHeaderItem> = [
	{
		header: 'Date',
		key: 'date',
		width: 20,
	},
	{
		header: 'Latitude',
		key: 'latitude',
		width: 13,
	},
	{
		header: 'Longitude',
		key: 'longitude',
		width: 13,
	},
	{
		header: 'Value',
		key: 'value',
		width: 21,
	},
	{
		header: 'Sensor',
		key: 'sensor',
		width: 15,
	},
];
