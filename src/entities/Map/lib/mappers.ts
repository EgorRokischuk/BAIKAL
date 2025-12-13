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
	IChlorophyllRequest,
	ILandsatRequest,
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
export const adaptGetLandsatData = (obj: ITileOptions): ILandsatRequest => ({
	data_type: typeDictionary[obj.productType],
	device: deviceDictionary[obj.source],
	parameter: parameterDictionary[obj.parameter],
	years_id: Number(dayjs(obj.startDate).format('YYYY')),
	month_id: Number(dayjs(obj.startDate).format('MM')),
	day_id: Number(dayjs(obj.startDate).format('DD')),
});

/** MONTHLY AVG */
export const adaptGetMonthlyAvgData = (obj: ITileOptions): IMonthlyAvgRequest => ({
	data_type: typeDictionary[obj.productType],
	device: deviceDictionary[obj.source],
	parameter: parameterDictionary[obj.parameter],
	time_of_day: photoTimeDictionary[obj.photoTime],
	years_id: Number(dayjs(obj.startDate).format('YYYY')),
	month_id: Number(dayjs(obj.startDate).format('MM')),
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

/** CHLOROFILL */
export const adaptGetChlorophyllData = (_obj: ITileOptions): IChlorophyllRequest => ({
        // Временно для тестирования отображения: сервер пока не принимает параметры.
});

/*export const adaptGetChlorophyllData = (obj: ITileOptions): IChlorophyllRequest => ({
        data_type: typeDictionary[obj.productType],
        device: deviceDictionary[obj.source] ?? obj.source,
        parameter: parameterDictionary[obj.parameter],
        years_id: obj.startDate ? Number(dayjs(obj.startDate).format('YYYY')) : undefined,
        month_id: obj.startDate ? Number(dayjs(obj.startDate).format('MM')) : undefined,
});*/
