import type { Dayjs } from 'dayjs';
import { LatLngLiteral } from 'leaflet';

/**
 * MAP STORE TYPES
 */
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

/**
 * GENERAL SATELLITE REQUEST TYPES
 */

interface IBaseSatelliteRequestParams {
	data_type: string;
	device: string;
	parameter: string;
}

/**
 * LANDSAT REQUEST TYPES
 */
export interface ILandsatAvailableDatesRequest extends IBaseSatelliteRequestParams {
	lst_num?: string;
}

export interface ILandsatRequest extends ILandsatAvailableDatesRequest {
	years_id: number;
	month_id: number;
	day_id: number;
	time_of_day?: string;
}

/**
 * MONTHLY AVG REQUEST TYPES
 */
interface IBaseMonthlyAvgRequestParams extends IBaseSatelliteRequestParams {
	time_of_day: string;
}

export interface IMonthlyAvgAvailableDatesRequest extends IBaseMonthlyAvgRequestParams {}

export interface IMonthlyAvgRequest extends IBaseMonthlyAvgRequestParams {
	years_id: number;
	month_id: number;
}

/**
 * MONTHLY AVG MANY YEARS REQUEST TYPES
 */
interface IBaseMonthlyAvgManyYearsRequestParams extends IBaseSatelliteRequestParams {
	time_of_day: string;
}

export interface IMonthlyAvgManyYearsAvailableDatesRequest
	extends IBaseMonthlyAvgManyYearsRequestParams {}

export interface IMonthlyAvgManyYearsRequest extends IBaseMonthlyAvgManyYearsRequestParams {
	month_id: number;
}

/**
 * GROUND DATA REQUEST TYPES
 */
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
	date: Date;
	latitude: number;
	longitude: number;
	value: string;
	sensor: string;
}
