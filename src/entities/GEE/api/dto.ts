import { convertToDateInput } from '@/shared/lib/datetimeFormat';
import {
	IGetGEEPointRequest,
	IGetGEEPointResponse,
	IGetGEEPolygonRequest,
	IGetGEEPolygonResponse,
} from '../types';

export interface IGetGEEPointRequestDTO {
	lat: number;
	lon: number;
	date: string;
}

export const adaptGEEPointRequest = (request: IGetGEEPointRequest): IGetGEEPointRequestDTO => ({
	lat: request.point[0],
	lon: request.point[1],
	date: convertToDateInput(request.dateStart),
});

export interface IGetGEEPointPeriodRequestDTO {
	lat: number;
	lon: number;
	start: string;
	end: string;
}

export const adaptGEEPointPeriodRequest = (
	request: IGetGEEPointRequest,
): IGetGEEPointPeriodRequestDTO => ({
	lat: request.point[0],
	lon: request.point[1],
	start: convertToDateInput(request.dateStart),
	end: convertToDateInput(request.dateEnd!),
});

export interface IGetGEEPointResponseDTO {
	lat: number;
	lon: number;
	date: string;
	'LST (°C)': number;
}

export const adaptGEEPointResponse = (dto: IGetGEEPointResponseDTO): IGetGEEPointResponse => ({
	lat: dto.lat,
	lon: dto.lon,
	dateStart: dto.date,
	value: dto['LST (°C)'],
});

export interface IGetGEEPointPeriodResponseDTO {
	lat: number;
	lon: number;
	start_date: string;
	end_date: string;
	'Mean LST (°C)': number;
}

export const adaptGEEPointPeriodResponse = (
	dto: IGetGEEPointPeriodResponseDTO,
): IGetGEEPointResponse => ({
	lat: dto.lat,
	lon: dto.lon,
	dateStart: dto.start_date,
	dateEnd: dto.end_date,
	value: dto['Mean LST (°C)'],
});

export interface IGetGEEPolygonRequestDTO {
	lat1: number;
	lon1: number;
	lat2: number;
	lon2: number;
	lat3: number;
	lon3: number;
	lat4: number;
	lon4: number;
	date: string;
}

export const adaptGEEPolygonRequest = (
	request: IGetGEEPolygonRequest,
): IGetGEEPolygonRequestDTO => ({
	lat1: request.shape[0].lat,
	lon1: request.shape[0].lng,
	lat2: request.shape[1].lat,
	lon2: request.shape[1].lng,
	lat3: request.shape[2].lat,
	lon3: request.shape[2].lng,
	lat4: request.shape[3].lat,
	lon4: request.shape[3].lng,
	date: convertToDateInput(request.dateStart),
});

export interface IGetGEEPolygonPeriodRequestDTO {
	lat1: number;
	lon1: number;
	lat2: number;
	lon2: number;
	lat3: number;
	lon3: number;
	lat4: number;
	lon4: number;
	start_date: string;
	end_date: string;
}

export const adaptGEEPolygonPeriodRequest = (
	request: IGetGEEPolygonRequest,
): IGetGEEPolygonPeriodRequestDTO => ({
	lat1: request.shape[0].lat,
	lon1: request.shape[0].lng,
	lat2: request.shape[1].lat,
	lon2: request.shape[1].lng,
	lat3: request.shape[2].lat,
	lon3: request.shape[2].lng,
	lat4: request.shape[3].lat,
	lon4: request.shape[3].lng,
	start_date: convertToDateInput(request.dateStart),
	end_date: convertToDateInput(request.dateEnd!),
});

export interface IGetGEEPolygonResponseDTO {
	date: string;
	region: Array<Array<number>>;
	download_url: string;
	note: string;
}

export const adaptGEEPolygonResponse = (
	dto: IGetGEEPolygonResponseDTO,
): IGetGEEPolygonResponse => ({
	dateStart: dto.date,
	shape: dto.region,
	url: dto.download_url,
	note: dto.note,
});

export interface IGetGEEPolygonPeriodResponseDTO {
	start_date: string;
	end_date: string;
	region: Array<Array<number>>;
	download_url: string;
	note: string;
}

export const adaptGEEPolygonPeriodResponse = (
	dto: IGetGEEPolygonPeriodResponseDTO,
): IGetGEEPolygonResponse => ({
	dateStart: dto.start_date,
	dateEnd: dto.end_date,
	shape: dto.region,
	url: dto.download_url,
	note: dto.note,
});
