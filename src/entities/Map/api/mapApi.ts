import { LatLngTuple } from 'leaflet';
import { globalActions } from '@/app/providers/store';
import { baseApi } from '@/shared/config/api/baseApi';
import { mapActions } from '../model/slices';
import {
	IGroundDataParametersRequest,
	IGroundDataPoint,
	IGroundDataRequest,
	IGroundDataSourcesRequest,
	ILandsatAvailableDatesRequest,
	ILandsatRequest,
	IMonthlyAvgAvailableDatesRequest,
	IMonthlyAvgManyYearsAvailableDatesRequest,
	IMonthlyAvgManyYearsRequest,
	IMonthlyAvgRequest,
} from '../types';

interface IGroundDataPointDTO {
	coordinates: LatLngTuple;
	value: number;
	unit: string;
	description_unit: string;
	sensor: string;
	date_time: string;
}

const adaptGroundDataPointDTO = (dto: IGroundDataPointDTO): IGroundDataPoint => ({
	...dto,
	date: new Date(dto.date_time),
	latitude: dto.coordinates[0],
	longitude: dto.coordinates[1],
	value: `${dto.value.toFixed(2)}${dto.unit}`,
});

const mapApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		/** LANDSAT */
		getLandsatDates: build.query<Array<string>, ILandsatAvailableDatesRequest>({
			query: (options) => ({
				url: 'files/satellite_data/get_available_dates_landsat',
				method: 'GET',
				params: { ...options },
			}),
			async onQueryStarted(_, { queryFulfilled }) {
				try {
					await queryFulfilled;
				} catch (e) {
					if (__IS_DEV__) console.error(e);
				}
			},
		}),
		getLandsatTileLink: build.query<string, ILandsatRequest>({
			query: (options) => ({
				url: 'files/satellite_data/get_landsat_tiles',
				method: 'GET',
				params: { ...options },
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
		getLandsatFile: build.query<string, ILandsatRequest>({
			query: (options) => ({
				url: 'files/satellite_data/get_landsat_link',
				method: 'GET',
				params: { ...options },
			}),
			async onQueryStarted(_, { queryFulfilled }) {
				try {
					await queryFulfilled;
				} catch (e) {
					if (__IS_DEV__) console.error(e);
				}
			},
		}),
		/** MONTHLY AVG */
		getMonthlyAvgDates: build.query<Array<string>, IMonthlyAvgAvailableDatesRequest>({
			query: (options) => ({
				url: 'files/satellite_data/get_available_dates_monthly_avg',
				method: 'GET',
				params: { ...options },
			}),
			async onQueryStarted(_, { queryFulfilled }) {
				try {
					await queryFulfilled;
				} catch (e) {
					if (__IS_DEV__) console.error(e);
				}
			},
		}),
		getMonthlyAvgTileLink: build.query<string, IMonthlyAvgRequest>({
			query: (options) => ({
				url: 'files/satellite_data/get_landsat_tiles',
				method: 'GET',
				params: { ...options },
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
		getMonthlyAvgFile: build.query<string, IMonthlyAvgRequest>({
			query: (options) => ({
				url: 'files/satellite_data/get_landsat_link',
				method: 'GET',
				params: { ...options },
			}),
			async onQueryStarted(_, { queryFulfilled }) {
				try {
					await queryFulfilled;
				} catch (e) {
					if (__IS_DEV__) console.error(e);
				}
			},
		}),
		/** MONTHLY AVG MANY YEARS */
		getMonthlyAvgManyYearsDates: build.query<
			Array<string>,
			IMonthlyAvgManyYearsAvailableDatesRequest
		>({
			query: (options) => ({
				url: 'files/satellite_data/get_available_dates_monthly_avg',
				method: 'GET',
				params: { ...options },
			}),
			async onQueryStarted(_, { queryFulfilled }) {
				try {
					await queryFulfilled;
				} catch (e) {
					if (__IS_DEV__) console.error(e);
				}
			},
		}),
		getMonthlyAvgManyYearsTileLink: build.query<string, IMonthlyAvgManyYearsRequest>({
			query: (options) => ({
				url: 'files/satellite_data/get_landsat_tiles',
				method: 'GET',
				params: { ...options },
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
		getMonthlyAvgManyYearsFile: build.query<string, IMonthlyAvgManyYearsRequest>({
			query: (options) => ({
				url: 'files/satellite_data/get_landsat_link',
				method: 'GET',
				params: { ...options },
			}),
			async onQueryStarted(_, { queryFulfilled }) {
				try {
					await queryFulfilled;
				} catch (e) {
					if (__IS_DEV__) console.error(e);
				}
			},
		}),
		/** GROUND DATA */
		getGroundDataParameters: build.query<Array<string>, IGroundDataParametersRequest>({
			query: (params) => ({
				url: 'files/ground_data/get_available_parameters',
				method: 'GET',
				params,
			}),
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					const response = await queryFulfilled;

					if (!response.data) dispatch(globalActions.setErrorMessage('Параметры отсутствуют!'));
				} catch (e) {
					if (__IS_DEV__) console.error(e);
				}
			},
			transformResponse: (baseQueryReturnValue) => {
				const data = baseQueryReturnValue as Array<string>;

				return !data.length ? undefined : data;
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
			transformResponse: (baseQueryReturnValue) => {
				const data = baseQueryReturnValue as Array<IGroundDataPointDTO>;

				return data.map(adaptGroundDataPointDTO);
			},
		}),
	}),
});

const {
	useGetLandsatDatesQuery,
	useGetLandsatTileLinkQuery,
	useGetLandsatFileQuery,
	useGetMonthlyAvgDatesQuery,
	useGetMonthlyAvgTileLinkQuery,
	useGetMonthlyAvgFileQuery,
	useGetMonthlyAvgManyYearsDatesQuery,
	useGetMonthlyAvgManyYearsTileLinkQuery,
	useGetMonthlyAvgManyYearsFileQuery,
	useGetGroundDataParametersQuery,
	useGetGroundDataSourcesQuery,
	useGetGroundDataPointsQuery,
} = mapApi;

export {
	mapApi,
	useGetLandsatDatesQuery,
	useGetLandsatTileLinkQuery,
	useGetLandsatFileQuery,
	useGetMonthlyAvgDatesQuery,
	useGetMonthlyAvgTileLinkQuery,
	useGetMonthlyAvgFileQuery,
	useGetMonthlyAvgManyYearsDatesQuery,
	useGetMonthlyAvgManyYearsTileLinkQuery,
	useGetMonthlyAvgManyYearsFileQuery,
	useGetGroundDataParametersQuery,
	useGetGroundDataSourcesQuery,
	useGetGroundDataPointsQuery,
};
