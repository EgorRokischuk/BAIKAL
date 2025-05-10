import dayjs from 'dayjs';
import { globalActions } from '@/app/providers/store';
import { baseApi } from '@/shared/config/api/baseApi';
import {
	deviceDictionary,
	parameterDictionary,
	photoTimeDictionary,
	typeDictionary,
} from '../config/dictionaries';
import { initTileDay, initTileYear } from '../lib';
import { mapActions } from '../model/slices';
import {
	IGroundDataParametersRequest,
	IGroundDataPoint,
	IGroundDataRequest,
	IGroundDataSourcesRequest,
	ITileOptions,
} from '../types';

interface ITileOptionsDTO {
	data_type: string;
	measured_parameter: string;
	measuring_device: string;
	time_of_day?: string;
	years_id: number;
	month_id?: number;
	day_id?: number;
}

const adaptTileOptionsDTO = (options: ITileOptions): ITileOptionsDTO => ({
	data_type: typeDictionary[options.productType],
	measured_parameter: parameterDictionary[options.parameter],
	measuring_device: deviceDictionary[options.source],
	time_of_day: options.photoTime ? photoTimeDictionary[options.photoTime] : undefined,
	years_id: initTileYear(options.photoType, options.startDate),
	month_id: Number(dayjs(options.startDate).format('MM')),
	day_id: initTileDay(options.source, options.startDate),
});

const mapApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getTileLink: build.mutation<string, ITileOptions>({
			query: (options) => ({
				url: 'files/get_tiles',
				method: 'GET',
				params: { ...adaptTileOptionsDTO(options) },
			}),
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					const response = await queryFulfilled;
					dispatch(mapActions.setTileLink(response.data));
				} catch (e) {
					if (__IS_DEV__) console.error(e);

					if (e.error.status == 404) {
						dispatch(globalActions.setErrorMessage('Данные отсутствуют'));
					}
				}
			},
		}),
		getTifFileLink: build.mutation<string, ITileOptions>({
			query: (options) => ({
				url: 'files/get_link',
				method: 'GET',
				params: { ...adaptTileOptionsDTO(options) },
			}),
			async onQueryStarted(_, { queryFulfilled }) {
				try {
					await queryFulfilled;
				} catch (e) {
					if (__IS_DEV__) console.error(e);
				}
			},
		}),
		getGroundDataParameters: build.query<Array<string>, IGroundDataParametersRequest>({
			query: (params) => ({
				url: 'files/ground_data/get_available_parameters',
				method: 'GET',
				params,
			}),
			async onQueryStarted(_, { queryFulfilled }) {
				try {
					await queryFulfilled;
				} catch (e) {
					if (__IS_DEV__) console.error(e);
				}
			},
		}),
		getGroundDataSources: build.query<Array<string>, IGroundDataSourcesRequest>({
			query: (params) => ({
				url: 'files/ground_data/get_available_sources',
				method: 'GET',
				params,
			}),
			async onQueryStarted(_, { queryFulfilled }) {
				try {
					await queryFulfilled;
				} catch (e) {
					if (__IS_DEV__) console.error(e);
				}
			},
		}),
		getGroundDataPoints: build.query<Array<IGroundDataPoint>, IGroundDataRequest>({
			query: (params) => ({
				url: 'files/ground_data/get_points',
				method: 'GET',
				params,
			}),
			async onQueryStarted(_, { queryFulfilled }) {
				try {
					await queryFulfilled;
				} catch (e) {
					if (__IS_DEV__) console.error(e);
				}
			},
		}),
	}),
});

const {
	useGetTileLinkMutation,
	useGetTifFileLinkMutation,
	useGetGroundDataParametersQuery,
	useGetGroundDataSourcesQuery,
	useGetGroundDataPointsQuery,
} = mapApi;

export {
	mapApi,
	useGetTileLinkMutation,
	useGetTifFileLinkMutation,
	useGetGroundDataParametersQuery,
	useGetGroundDataSourcesQuery,
	useGetGroundDataPointsQuery,
};
