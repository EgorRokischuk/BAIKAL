import {
	typeDictionary,
	deviceDictionary,
	parameterDictionary,
	photoTimeDictionary,
} from '@/entities/Map/config/dictionaries';
import {
	ILandsatAvailableDatesRequest,
	IMonthlyAvgAvailableDatesRequest,
	IMonthlyAvgManyYearsAvailableDatesRequest,
	IChlorophyllAvailableDatesRequest,
	ITileOptions,
} from '@/entities/Map/types';

export const adaptGetLandsatAvailableDates = (
	obj: ITileOptions,
): ILandsatAvailableDatesRequest => ({
	data_type: typeDictionary[obj.productType],
	device: deviceDictionary[obj.source],
	parameter: parameterDictionary[obj.parameter],
});

export const adaptGetMonthlyAvgAvailableDates = (
	obj: ITileOptions,
): IMonthlyAvgAvailableDatesRequest => ({
	data_type: typeDictionary[obj.productType],
	device: deviceDictionary[obj.source],
	parameter: parameterDictionary[obj.parameter],
	time_of_day: photoTimeDictionary[obj.photoTime],
});

export const adaptGetMonthlyAvgManyYearsAvailableDates = (
	obj: ITileOptions,
): IMonthlyAvgManyYearsAvailableDatesRequest => ({
	data_type: typeDictionary[obj.productType],
	device: deviceDictionary[obj.source],
	parameter: parameterDictionary[obj.parameter],
	time_of_day: photoTimeDictionary[obj.photoTime],
});

export const adaptGetChlorophyllAvailableDates = (
	obj: ITileOptions,
): IChlorophyllAvailableDatesRequest => ({
	data_type: typeDictionary[obj.productType],
	device: deviceDictionary[obj.source],
	parameter: parameterDictionary[obj.parameter],
});
