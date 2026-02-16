import { baseApi } from '@/api/baseApi';
import { appActions } from '@/store/slices/appSlice';
import { geeActions } from '@/store/slices/geeSlice';
import {
  mapGeePointPeriodQuery,
  mapGeePointPeriodResponse,
  mapGeePointQuery,
  mapGeePointResponse,
  mapGeePolygonPeriodQuery,
  mapGeePolygonPeriodResponse,
  mapGeePolygonQuery,
  mapGeePolygonResponse,
} from './model/mappers';
import type {
  GeePointPeriodResponseDto,
  GeePointRequest,
  GeePointResponse,
  GeePointResponseDto,
  GeePolygonPeriodResponseDto,
  GeePolygonRequest,
  GeePolygonResponse,
  GeePolygonResponseDto,
} from './model/types';

export const geeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPointValue: build.query<GeePointResponse, GeePointRequest>({
      query: (payload) => ({
        url: 'gee/lst/point/date/',
        method: 'GET',
        params: mapGeePointQuery(payload),
      }),
      transformResponse: (data: GeePointResponseDto) => mapGeePointResponse(data),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(geeActions.setPointValue(data.value));
        } catch {
          dispatch(appActions.showError('Failed to get GEE point value.'));
        }
      },
    }),
    getPointValuePeriod: build.query<GeePointResponse, GeePointRequest>({
      query: (payload) => ({
        url: 'gee/lst/period/',
        method: 'GET',
        params: mapGeePointPeriodQuery(payload),
      }),
      transformResponse: (data: GeePointPeriodResponseDto) => mapGeePointPeriodResponse(data),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(geeActions.setPointValue(data.value));
        } catch {
          dispatch(appActions.showError('Failed to get GEE point value for period.'));
        }
      },
    }),
    getPolygonValue: build.query<GeePolygonResponse, GeePolygonRequest>({
      query: (payload) => ({
        url: 'gee/lst/geotiff/temp/',
        method: 'GET',
        params: mapGeePolygonQuery(payload),
      }),
      transformResponse: (data: GeePolygonResponseDto) => mapGeePolygonResponse(data),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          dispatch(appActions.showError('Failed to generate polygon product.'));
        }
      },
    }),
    getPolygonValuePeriod: build.query<GeePolygonResponse, GeePolygonRequest>({
      query: (payload) => ({
        url: 'gee/lst/geotiff/period/temp/',
        method: 'GET',
        params: mapGeePolygonPeriodQuery(payload),
      }),
      transformResponse: (data: GeePolygonPeriodResponseDto) =>
        mapGeePolygonPeriodResponse(data),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          dispatch(appActions.showError('Failed to generate polygon product for period.'));
        }
      },
    }),
  }),
});

export const {
  useLazyGetPointValueQuery,
  useLazyGetPointValuePeriodQuery,
  useLazyGetPolygonValueQuery,
  useLazyGetPolygonValuePeriodQuery,
} = geeApi;
