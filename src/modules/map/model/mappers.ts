import dayjs from 'dayjs';
import {
  deviceDictionary,
  parameterDictionary,
  photoTimeDictionary,
  resolveSatelliteDataType,
} from './dictionaries';
import type {
  ChlorophyllRequest,
  GroundDataPoint,
  GroundDataPointDto,
  LandsatRequest,
  MonthlyAvgManyYearsRequest,
  MonthlyAvgRequest,
  TileOptions,
} from './types';

export const mapGroundDataPoint = (dto: GroundDataPointDto): GroundDataPoint => ({
  date: new Date(dto.date_time),
  latitude: dto.coordinates[0],
  longitude: dto.coordinates[1],
  value: `${dto.value.toFixed(2)}${dto.unit}`,
  sensor: dto.sensor,
});

export const mapLandsatParams = (options: TileOptions): LandsatRequest => ({
  data_type: resolveSatelliteDataType(options.productType),
  device: deviceDictionary[options.source],
  parameter: parameterDictionary[options.parameter],
  years_id: Number(dayjs(options.startDate).format('YYYY')),
  month_id: Number(dayjs(options.startDate).format('MM')),
  day_id: Number(dayjs(options.startDate).format('DD')),
});

export const mapMonthlyAvgParams = (options: TileOptions): MonthlyAvgRequest => ({
  data_type: resolveSatelliteDataType(options.productType),
  device: deviceDictionary[options.source],
  parameter: parameterDictionary[options.parameter],
  time_of_day: photoTimeDictionary[options.photoTime ?? ''],
  years_id: Number(dayjs(options.startDate).format('YYYY')),
  month_id: Number(dayjs(options.startDate).format('MM')),
});

export const mapMonthlyAvgManyYearsParams = (
  options: TileOptions,
): MonthlyAvgManyYearsRequest => ({
  data_type: resolveSatelliteDataType(options.productType),
  device: deviceDictionary[options.source],
  parameter: parameterDictionary[options.parameter],
  time_of_day: photoTimeDictionary[options.photoTime ?? ''],
  month_id: Number(dayjs(options.startDate).format('MM')),
});

export const mapChlorophyllParams = (options: TileOptions): ChlorophyllRequest => ({
  data_type: resolveSatelliteDataType(options.productType),
  device: deviceDictionary[options.source],
  month_id: Number(dayjs(options.startDate).format('MM')),
});
