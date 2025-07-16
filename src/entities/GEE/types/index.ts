import { Dayjs } from 'dayjs';

export interface IGEEState {
	type: string;
	dateStart: Dayjs | null;
	dateEnd?: Dayjs | null;
	point: Array<number>;
}

export interface IGetGEEPointRequest {
	dateStart: string;
	dateEnd?: string;
	point: Array<number>;
}

export interface IGetGEEPointResponse {
	lat: number;
	lon: number;
	dateStart: string;
	dateEnd?: string;
	value: number;
}
