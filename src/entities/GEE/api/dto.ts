import { convertToDateInput } from '@/shared/lib/datetimeFormat';
import { IGetGEEPointRequest, IGetGEEPointResponse } from '../types';

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
