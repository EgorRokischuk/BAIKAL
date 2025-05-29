import dayjs from 'dayjs';
import { LatLngTuple } from 'leaflet';
import {
	deviceDictionary,
	parameterDictionary,
	photoTimeDictionary,
	typeDictionary,
} from '../config/dictionaries';
import {
	IGroundDataPoint,
	ILandsatAvailableDatesRequest,
	ILandsatRequest,
	IMonthlyAvgAvailableDatesRequest,
	IMonthlyAvgManyYearsAvailableDatesRequest,
	IMonthlyAvgManyYearsRequest,
	IMonthlyAvgRequest,
	ITileOptions,
} from '../types';

/** GROUND DATA */

export interface IGroundDataPointDTO {
	coordinates: LatLngTuple;
	value: number;
	unit: string;
	description_unit: string;
	sensor: string;
	date_time: string;
}

export const adaptGroundDataPointDTO = (dto: IGroundDataPointDTO): IGroundDataPoint => ({
	...dto,
	date: new Date(dto.date_time),
	latitude: dto.coordinates[0],
	longitude: dto.coordinates[1],
	value: `${dto.value.toFixed(2)}${dto.unit}`,
});

/** LANDSAT */

export const adaptGetLandsatAvailableDates = (
	obj: ITileOptions,
): ILandsatAvailableDatesRequest => ({
	data_type: typeDictionary[obj.productType],
	device: deviceDictionary[obj.source],
	parameter: parameterDictionary[obj.parameter],
});

export const adaptGetLandsatData = (obj: ITileOptions): ILandsatRequest => ({
	data_type: typeDictionary[obj.productType],
	device: deviceDictionary[obj.source],
	parameter: parameterDictionary[obj.parameter],
	years_id: Number(dayjs(obj.startDate).format('YYYY')),
	month_id: Number(dayjs(obj.startDate).format('MM')),
	day_id: Number(dayjs(obj.startDate).format('DD')),
});

/** MONTHLY AVG */

export const adaptGetMonthlyAvgAvailableDates = (
	obj: ITileOptions,
): IMonthlyAvgAvailableDatesRequest => ({
	data_type: typeDictionary[obj.productType],
	device: deviceDictionary[obj.source],
	parameter: parameterDictionary[obj.parameter],
	time_of_day: photoTimeDictionary[obj.photoTime],
});

export const adaptGetMonthlyAvgData = (obj: ITileOptions): IMonthlyAvgRequest => ({
	data_type: typeDictionary[obj.productType],
	device: deviceDictionary[obj.source],
	parameter: parameterDictionary[obj.parameter],
	time_of_day: photoTimeDictionary[obj.photoTime],
	years_id: Number(dayjs(obj.startDate).format('YYYY')),
	month_id: Number(dayjs(obj.startDate).format('MM')),
});

/** MONTHLY AVG MANY YEARS */

export const adaptGetMonthlyAvgManyYearsAvailableDates = (
	obj: ITileOptions,
): IMonthlyAvgManyYearsAvailableDatesRequest => ({
	data_type: typeDictionary[obj.productType],
	device: deviceDictionary[obj.source],
	parameter: parameterDictionary[obj.parameter],
	time_of_day: photoTimeDictionary[obj.photoTime],
});

export const adaptGetMonthlyAvgManyYearsData = (
	obj: ITileOptions,
): IMonthlyAvgManyYearsRequest => ({
	data_type: typeDictionary[obj.productType],
	device: deviceDictionary[obj.source],
	parameter: parameterDictionary[obj.parameter],
	time_of_day: photoTimeDictionary[obj.photoTime],
	month_id: Number(dayjs(obj.startDate).format('MM')),
});
