import { Dayjs } from 'dayjs';
import { LatLng } from 'leaflet';

export interface IGEEState {
	type: string;
	dateStart: Dayjs | null;
	dateEnd?: Dayjs | null;
	point: Array<number>;
	shape: Array<LatLng>;
	value?: number;
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
