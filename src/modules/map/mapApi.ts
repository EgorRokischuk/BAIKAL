import { baseApi } from '@/api/baseApi';
import { appActions } from '@/store/slices/appSlice';
import { mapActions } from '@/store/slices/mapSlice';
import {
  mapChlorophyllParams,
  mapGroundDataPoint,
  mapLandsatParams,
  mapMonthlyAvgManyYearsParams,
  mapMonthlyAvgParams,
} from './model/mappers';
import type {
  ChlorophyllAvailableDatesRequest,
  GetTileLinkResponse,
  GroundDataParameterRequest,
  GroundDataPoint,
  GroundDataPointDto,
  GroundDataRequest,
  GroundDataSourceRequest,
  LandsatAvailableDatesRequest,
  LandsatPointRequest,
  MonthlyAvgAvailableDatesRequest,
  MonthlyAvgManyYearsPointRequest,
  MonthlyAvgPointRequest,
  TileOptions,
} from './model/types';

const setLegendFromResponse = (response: Partial<GetTileLinkResponse>) => {
  const min = response.min_temp ?? response.min;
  const max = response.max_temp ?? response.max;

  if (typeof min === 'number' && typeof max === 'number') {
    return { min, max };
  }

  return null;
};

export const mapApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLandsatDates: build.query<string[], LandsatAvailableDatesRequest>({
      query: (params) => ({
        url: 'files/satellite_data/get_available_dates_landsat',
        method: 'GET',
        params,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (!data.length) {
            dispatch(appActions.showWarning('Нет данных для выбранных фильтров.'));
          }
        } catch {
          dispatch(appActions.showError('Failed to get available dates.'));
        }
      },
    }),
    getLandsatTileLink: build.mutation<GetTileLinkResponse, TileOptions>({
      query: (options) => ({
        url: 'files/satellite_data/get_landsat_tiles',
        method: 'GET',
        params: mapLandsatParams(options),
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(mapActions.setTileLink(data.link));
          const legend = setLegendFromResponse(data);
          if (legend) dispatch(mapActions.setLegend(legend));
        } catch {
          dispatch(appActions.showError('No raster tiles for selected date.'));
        }
      },
    }),
    getLandsatTileLinkRaw: build.mutation<GetTileLinkResponse, TileOptions>({
      query: (options) => ({
        url: 'files/satellite_data/get_landsat_tiles',
        method: 'GET',
        params: mapLandsatParams(options),
      }),
    }),
    getLandsatFile: build.mutation<string, TileOptions>({
      query: (options) => ({
        url: 'files/satellite_data/get_landsat_link',
        method: 'GET',
        params: mapLandsatParams(options),
      }),
    }),
    getLandsatPoint: build.mutation<string, LandsatPointRequest>({
      query: (params) => ({
        url: 'files/satellite_data/get_temperature_at_point_landsat',
        method: 'GET',
        params,
      }),
      transformResponse: (data: number) => data.toFixed(2),
    }),
    getMonthlyAvgDates: build.query<string[], MonthlyAvgAvailableDatesRequest>({
      query: ({ data_type, device, parameter, time_of_day }) => ({
        url: 'files/satellite_data/get_available_dates_monthly_avg',
        method: 'GET',
        params: {
          data_type,
          device,
          parameter,
          time_of_day,
        },
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (!data.length && !args.silent) {
            dispatch(appActions.showWarning('Нет данных для выбранных фильтров.'));
          }
        } catch {
          if (!args.silent) {
            dispatch(appActions.showError('Failed to get available dates.'));
          }
        }
      },
    }),
    getMonthlyAvgTileLink: build.mutation<GetTileLinkResponse, TileOptions>({
      query: (options) => ({
        url: 'files/satellite_data/get_monthly_avg_tiles',
        method: 'GET',
        params: mapMonthlyAvgParams(options),
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(mapActions.setTileLink(data.link));
          const legend = setLegendFromResponse(data);
          if (legend) dispatch(mapActions.setLegend(legend));
        } catch {
          dispatch(appActions.showError('No raster tiles for selected period.'));
        }
      },
    }),
    getMonthlyAvgTileLinkRaw: build.mutation<GetTileLinkResponse, TileOptions>({
      query: (options) => ({
        url: 'files/satellite_data/get_monthly_avg_tiles',
        method: 'GET',
        params: mapMonthlyAvgParams(options),
      }),
    }),
    getMonthlyAvgFile: build.mutation<string, TileOptions>({
      query: (options) => ({
        url: 'files/satellite_data/get_monthly_avg_file_link',
        method: 'GET',
        params: mapMonthlyAvgParams(options),
      }),
    }),
    getMonthlyAvgPoint: build.mutation<string, MonthlyAvgPointRequest>({
      query: (params) => ({
        url: 'files/satellite_data/get_temperature_at_point_monthly_avg',
        method: 'GET',
        params,
      }),
      transformResponse: (data: number) => data.toFixed(2),
    }),
    getMonthlyAvgManyYearsDates: build.query<string[], MonthlyAvgAvailableDatesRequest>({
      query: ({ data_type, device, parameter, time_of_day }) => ({
        url: 'files/satellite_data/get_available_dates_monthly_avg_many_years',
        method: 'GET',
        params: {
          data_type,
          device,
          parameter,
          time_of_day,
        },
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (!data.length && !args.silent) {
            dispatch(appActions.showWarning('Нет данных для выбранных фильтров.'));
          }
        } catch {
          if (!args.silent) {
            dispatch(appActions.showError('Failed to get available dates.'));
          }
        }
      },
    }),
    getMonthlyAvgManyYearsTileLink: build.mutation<GetTileLinkResponse, TileOptions>({
      query: (options) => ({
        url: 'files/satellite_data/get_monthly_avg_many_years_tiles',
        method: 'GET',
        params: mapMonthlyAvgManyYearsParams(options),
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(mapActions.setTileLink(data.link));
          const legend = setLegendFromResponse(data);
          if (legend) dispatch(mapActions.setLegend(legend));
        } catch {
          dispatch(appActions.showError('No raster tiles for selected period.'));
        }
      },
    }),
    getMonthlyAvgManyYearsTileLinkRaw: build.mutation<GetTileLinkResponse, TileOptions>({
      query: (options) => ({
        url: 'files/satellite_data/get_monthly_avg_many_years_tiles',
        method: 'GET',
        params: mapMonthlyAvgManyYearsParams(options),
      }),
    }),
    getMonthlyAvgManyYearsFile: build.mutation<string, TileOptions>({
      query: (options) => ({
        url: 'files/satellite_data/get_monthly_avg_many_years_file_link',
        method: 'GET',
        params: mapMonthlyAvgManyYearsParams(options),
      }),
    }),
    getMonthlyAvgManyYearsPoint: build.mutation<string, MonthlyAvgManyYearsPointRequest>({
      query: (params) => ({
        url: 'files/satellite_data/get_temperature_at_point_monthly_avg_many_years',
        method: 'GET',
        params,
      }),
      transformResponse: (data: number) => data.toFixed(2),
    }),
    getChlorophyllAvailableDates: build.query<string[], ChlorophyllAvailableDatesRequest>({
      query: (params) => ({
        url: 'files/ground_data/get_available_dates_chlorophyll',
        method: 'GET',
        params,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (!data.length) {
            dispatch(appActions.showWarning('Нет данных по хлорофиллу за выбранный месяц.'));
          }
        } catch {
          dispatch(appActions.showError('Failed to get chlorophyll dates.'));
        }
      },
    }),
    getChlorophyllTileLink: build.mutation<GetTileLinkResponse, TileOptions>({
      query: (options) => ({
        url: 'files/ground_data/get_chlorophyll_monthly_avg_tiles',
        method: 'GET',
        params: mapChlorophyllParams(options),
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(mapActions.setTileLink(data.link));

          const legend = setLegendFromResponse(data);
          if (legend) {
            dispatch(mapActions.setLegend(legend));
          } else {
            dispatch(mapActions.hideLegend());
          }
        } catch {
          dispatch(appActions.showError('No chlorophyll tiles for selected month.'));
        }
      },
    }),
    getChlorophyllTileLinkRaw: build.mutation<GetTileLinkResponse, TileOptions>({
      query: (options) => ({
        url: 'files/ground_data/get_chlorophyll_monthly_avg_tiles',
        method: 'GET',
        params: mapChlorophyllParams(options),
      }),
    }),
    getChlorophyllFile: build.mutation<string, TileOptions>({
      query: (options) => ({
        url: 'files/ground_data/get_chlorophyll_monthly_avg_file_link',
        method: 'GET',
        params: mapChlorophyllParams(options),
      }),
    }),
    getGroundDataAvailableDates: build.query<string[], void>({
      query: () => ({
        url: 'files/ground_data/get_available_dates',
        method: 'GET',
      }),
    }),
    getGroundDataParameters: build.query<string[], GroundDataParameterRequest>({
      query: (params) => ({
        url: 'files/ground_data/get_available_parameters',
        method: 'GET',
        params,
      }),
      transformResponse: (data: string[]) => data || [],
    }),
    getGroundDataSources: build.query<string[], GroundDataSourceRequest>({
      query: (params) => ({
        url: 'files/ground_data/get_available_sources',
        method: 'GET',
        params,
      }),
      transformResponse: (data: string[]) => data || [],
    }),
    getGroundDataPoints: build.query<GroundDataPoint[], GroundDataRequest>({
      query: (params) => ({
        url: 'files/ground_data/get_points',
        method: 'GET',
        params,
      }),
      transformResponse: (data: GroundDataPointDto[]) => data.map(mapGroundDataPoint),
    }),
  }),
});

export const {
  useGetLandsatDatesQuery,
  useGetLandsatTileLinkMutation,
  useGetLandsatTileLinkRawMutation,
  useGetLandsatFileMutation,
  useGetLandsatPointMutation,
  useGetMonthlyAvgDatesQuery,
  useGetMonthlyAvgTileLinkMutation,
  useGetMonthlyAvgTileLinkRawMutation,
  useGetMonthlyAvgFileMutation,
  useGetMonthlyAvgPointMutation,
  useGetMonthlyAvgManyYearsDatesQuery,
  useGetMonthlyAvgManyYearsTileLinkMutation,
  useGetMonthlyAvgManyYearsTileLinkRawMutation,
  useGetMonthlyAvgManyYearsFileMutation,
  useGetMonthlyAvgManyYearsPointMutation,
  useGetChlorophyllAvailableDatesQuery,
  useGetChlorophyllTileLinkMutation,
  useGetChlorophyllTileLinkRawMutation,
  useGetChlorophyllFileMutation,
  useGetGroundDataAvailableDatesQuery,
  useGetGroundDataParametersQuery,
  useGetGroundDataSourcesQuery,
  useGetGroundDataPointsQuery,
  useLazyGetGroundDataPointsQuery,
} = mapApi;

