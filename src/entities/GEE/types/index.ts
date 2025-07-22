import { Dayjs } from 'dayjs';
import { LatLng } from 'leaflet';

export interface IGEEState {
	type: string;
	dateStart: Dayjs | null;
	dateEnd?: Dayjs | null;

	point: Array<number>;
	value?: number;

	shape: Array<LatLng>;
}

export interface IGetGEEPointRequest {
	dateStart: Dayjs | null;
	dateEnd?: Dayjs | null;
	point: Array<number>;
}

export interface IGetGEEPointResponse {
	lat: number;
	lon: number;
	dateStart: string;
	dateEnd?: string;
	value: number;
}

export interface IGetGEEPolygonRequest {
	dateStart: Dayjs | null;
	dateEnd?: Dayjs | null;
	shape: Array<LatLng>;
}

export interface IGetGEEPolygonResponse {
	dateStart: string;
	dateEnd?: string;
	shape: Array<Array<number>>;
	url: string;
	note: string;
}
