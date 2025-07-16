import { globalActions } from '@/app/providers/store';
import { baseApi } from '@/shared/config/api/baseApi';
import { IGetGEEPointRequest, IGetGEEPointResponse } from '../types';
import {
	adaptGEEPointPeriodRequest,
	adaptGEEPointPeriodResponse,
	adaptGEEPointRequest,
	adaptGEEPointResponse,
	IGetGEEPointPeriodResponseDTO,
	IGetGEEPointResponseDTO,
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
					await queryFulfilled;
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
					await queryFulfilled;
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
	}),
});

const { useGetPointValueQuery, useGetPointValuePeriodQuery } = geeApi;

export { geeApi, useGetPointValueQuery, useGetPointValuePeriodQuery };
