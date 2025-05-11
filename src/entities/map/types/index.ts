import type { Dayjs } from 'dayjs';
import { LatLngLiteral, LatLngTuple } from 'leaflet';

export interface ITileOptions {
	productType: string;
	parameter: string;
	source: string;
	photoType?: string;
	photoTime: string | null;
	startDate: Dayjs | null;
	endDate: Dayjs | null;
}

export interface IMapState {
	zoom: number;
	location: LatLngLiteral;
	isPointsVisible: boolean;
	tileLink: string;
	tileOptions: ITileOptions;
}

export interface IMapMenuContent extends React.FC {}

export interface IMapMenuItem {
	title: string;
	key: keyof Omit<ITileOptions, 'startDate' | 'endDate'>;
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
	coordinates: LatLngTuple;
	value: number;
	unit: string;
	description_unit: string;
	sensor: string;
}
