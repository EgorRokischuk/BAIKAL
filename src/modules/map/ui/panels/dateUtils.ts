import { useMemo } from 'react';
import {
  useGetChlorophyllAvailableDatesQuery,
  useGetGroundDataAvailableDatesQuery,
  useGetLandsatDatesQuery,
  useGetMonthlyAvgDatesQuery,
  useGetMonthlyAvgManyYearsDatesQuery,
} from '@/modules/map/mapApi';
import {
  deviceDictionary,
  parameterDictionary,
  photoTimeDictionary,
  resolveSatelliteDataType,
} from '@/modules/map/model/dictionaries';
import type { TileOptions } from '@/modules/map/model/types';

export const useAvailableDates = (kind: string, options: TileOptions) => {
  const landsatArgs = useMemo(
    () => ({
      data_type: resolveSatelliteDataType(options.productType),
      device: deviceDictionary[options.source],
      parameter: parameterDictionary[options.parameter],
    }),
    [options.parameter, options.productType, options.source],
  );

  const monthlyArgs = useMemo(
    () => ({
      data_type: resolveSatelliteDataType(options.productType),
      device: deviceDictionary[options.source],
      parameter: parameterDictionary[options.parameter],
      time_of_day: photoTimeDictionary[options.photoTime ?? ''],
      silent: true,
    }),
    [options.parameter, options.photoTime, options.productType, options.source],
  );

  const chlorophyllArgs = useMemo(
    () => ({
      data_type: resolveSatelliteDataType(options.productType),
      device: deviceDictionary[options.source],
    }),
    [options.productType, options.source],
  );

  const landsat = useGetLandsatDatesQuery(landsatArgs, {
    skip: options.type !== 'landsat',
  });

  const monthly = useGetMonthlyAvgDatesQuery(monthlyArgs, {
    skip: options.type !== 'monthlyAvg' || !options.photoTime,
  });

  const monthlyManyYears = useGetMonthlyAvgManyYearsDatesQuery(monthlyArgs, {
    skip: options.type !== 'monthlyAvgManyYears' || !options.photoTime,
  });

  const chlorophyll = useGetChlorophyllAvailableDatesQuery(chlorophyllArgs, {
    skip: options.type !== 'chlorophyll',
  });

  const ground = useGetGroundDataAvailableDatesQuery(undefined, {
    skip: options.type !== 'groundData',
  });

  switch (kind) {
    case 'landsat':
      return { data: landsat.data || [], isLoading: landsat.isFetching };
    case 'monthlyAvg':
      return { data: monthly.data || [], isLoading: monthly.isFetching };
    case 'monthlyAvgManyYears':
      return { data: monthlyManyYears.data || [], isLoading: monthlyManyYears.isFetching };
    case 'chlorophyll':
      return { data: chlorophyll.data || [], isLoading: chlorophyll.isFetching };
    case 'groundData':
      return { data: ground.data || [], isLoading: ground.isFetching };
    default:
      return { data: [], isLoading: false };
  }
};
