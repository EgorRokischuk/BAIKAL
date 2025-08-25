import { globalActions } from '@/app/providers/store';
import { baseApi } from '@/shared/config/api/baseApi';
import { geeActions } from '../model/slices';
import {
	IGetGEEPointRequest,
	IGetGEEPointResponse,
	IGetGEEPolygonRequest,
	IGetGEEPolygonResponse,
} from '../types';
import {
	adaptGEEPointPeriodRequest,
	adaptGEEPointPeriodResponse,
	adaptGEEPointRequest,
	adaptGEEPointResponse,
	adaptGEEPolygonPeriodRequest,
	adaptGEEPolygonPeriodResponse,
	adaptGEEPolygonRequest,
	adaptGEEPolygonResponse,
	IGetGEEPointPeriodResponseDTO,
	IGetGEEPointResponseDTO,
	IGetGEEPolygonPeriodResponseDTO,
	IGetGEEPolygonResponseDTO,
} from './dto';

const geeApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getPointValue: build.query<IGetGEEPointResponse, IGetGEEPointRequest>({
			query: (params) => ({
				url: 'gee/lst/point/date/',
				method: 'GET',
				params: { ...adaptGEEPointRequest(params) },
			}),
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					const response = await queryFulfilled;

					dispatch(geeActions.setPointValue(response.data.value));
				} catch (e) {
					if (__IS_DEV__) console.error(e);

					dispatch(globalActions.setErrorMessage('Ошибка получения значения с GEE!'));
				}
			},
			transformResponse: (baseQueryReturnValue) => {
				const data = baseQueryReturnValue as IGetGEEPointResponseDTO;

				return adaptGEEPointResponse(data);
			},
		}),
		getPointValuePeriod: build.query<IGetGEEPointResponse, IGetGEEPointRequest>({
			query: (params) => ({
				url: 'gee/lst/period/',
				method: 'GET',
				params: { ...adaptGEEPointPeriodRequest(params) },
			}),
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					const response = await queryFulfilled;

					dispatch(geeActions.setPointValue(response.data.value));
				} catch (e) {
					if (__IS_DEV__) console.error(e);

					dispatch(globalActions.setErrorMessage('Ошибка получения значения с GEE!'));
				}
			},
			transformResponse: (baseQueryReturnValue) => {
				const data = baseQueryReturnValue as IGetGEEPointPeriodResponseDTO;

				return adaptGEEPointPeriodResponse(data);
			},
		}),
		getPolygonValue: build.query<IGetGEEPolygonResponse, IGetGEEPolygonRequest>({
			query: (params) => ({
				url: 'gee/lst/geotiff/temp/',
				method: 'GET',
				params: { ...adaptGEEPolygonRequest(params) },
			}),
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;
				} catch (e) {
					if (__IS_DEV__) console.error(e);

					dispatch(globalActions.setErrorMessage('Ошибка получения данных с GEE!'));
				}
			},
			transformResponse: (baseQueryReturnValue) => {
				const data = baseQueryReturnValue as IGetGEEPolygonResponseDTO;

				return adaptGEEPolygonResponse(data);
			},
		}),
		getPolygonValuePeriod: build.query<IGetGEEPolygonResponse, IGetGEEPolygonRequest>({
			query: (params) => ({
				url: 'gee/lst/geotiff/period/temp/',
				method: 'GET',
				params: { ...adaptGEEPolygonPeriodRequest(params) },
			}),
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;
				} catch (e) {
					if (__IS_DEV__) console.error(e);

					dispatch(globalActions.setErrorMessage('Ошибка получения данных с GEE!'));
				}
			},
			transformResponse: (baseQueryReturnValue) => {
				const data = baseQueryReturnValue as IGetGEEPolygonPeriodResponseDTO;

				return adaptGEEPolygonPeriodResponse(data);
			},
		}),
	}),
});

const {
	useLazyGetPointValueQuery,
	useLazyGetPointValuePeriodQuery,
	useLazyGetPolygonValueQuery,
	useLazyGetPolygonValuePeriodQuery,
} = geeApi;

export {
	geeApi,
	useLazyGetPointValueQuery,
	useLazyGetPointValuePeriodQuery,
	useLazyGetPolygonValueQuery,
	useLazyGetPolygonValuePeriodQuery,
};
