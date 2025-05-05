import type { Dayjs } from 'dayjs';
import { LatLngLiteral } from 'leaflet';

export interface ITileOptions {
	type: string;
	parameter: string;
	device: string;
	photoType?: string;
	photoTime: string | null;
	date: Dayjs | null;
}

export interface IMapState {
	zoom: number;
	location: LatLngLiteral;
	isTileVisible: boolean;
	tileLink: string;
	tileOptions: ITileOptions;
}

export interface IMapMenuContent extends React.ReactElement {}

export interface IMapMenuItem {
	title: string;
	key: keyof Omit<ITileOptions, 'date'>;
	value: string;
	content: IMapMenuContent;
}

export interface IMapMenu extends Array<IMapMenuItem> {}

export interface IGroundDataParametersRequest {
	startDate: string;
	endDate?: string;
}

export interface IGroundDataSourcesRequest extends IGroundDataParametersRequest {
	parameter: string;
}

export interface IGroundDataRequest extends IGroundDataSourcesRequest {
	source: string;
}

export interface IGroundDataPoint {
	coordinates: Array<number>;
	value: number;
	unit: string;
	description_unit: string;
	sensor: string;
}
