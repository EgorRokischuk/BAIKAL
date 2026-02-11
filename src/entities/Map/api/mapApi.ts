import { globalActions } from '@/app/providers/store';
import { baseApi } from '@/shared/config/api/baseApi';
import {
	adaptGetLandsatData,
	adaptGetMonthlyAvgData,
	adaptGetMonthlyAvgManyYearsData,
	adaptGetChlorophyllData,
	adaptGroundDataPointDTO,
	IGroundDataPointDTO,
} from '../lib/mappers';
import { mapActions } from '../model/slices';
import {
	IGetTileLinkResponse,
	IGroundDataParametersRequest,
	IGroundDataPoint,
	IGroundDataRequest,
	IGroundDataSourcesRequest,
	ILandsatAvailableDatesRequest,
	ILandsatPointRequest,
	IMonthlyAvgAvailableDatesRequest,
	IMonthlyAvgManyYearsPointRequest,
	IMonthlyAvgPointRequest,
	ITileOptions,
	IChlorophyllAvailableDatesRequest,
} from '../types';

const mapApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		/** LANDSAT */
		getLandsatDates: build.query<Array<string>, ILandsatAvailableDatesRequest>({
			query: (options) => ({
				url: 'files/satellite_data/get_available_dates_landsat',
				method: 'GET',
				params: { ...options },
			}),
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					const response = await queryFulfilled;
					if (!response.data.length) {
						dispatch(globalActions.setErrorMessage('Данные отсутствуют'));
					}
				} catch (e) {
					if (__IS_DEV__) console.error(e);
				}
			},
		}),

		getLandsatTileLink: build.mutation<IGetTileLinkResponse, ITileOptions>({
			query: (options) => ({
				url: 'files/satellite_data/get_landsat_tiles',
				method: 'GET',
				params: { ...adaptGetLandsatData(options) },
			}),
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					const response = await queryFulfilled;

					dispatch(mapActions.setTileLink(response.data.link));
					dispatch(
						mapActions.setLegend({
							min: response.data.min_temp,
							max: response.data.max_temp,
						}),
					);
				} catch (e: any) {
					if (__IS_DEV__) console.error(e);

					if (e?.error?.status === 404) {
						dispatch(globalActions.setErrorMessage('Данные отсутствуют'));
					}
				}
			},
		}),

		getLandsatFile: build.mutation<string, ITileOptions>({
			query: (options) => ({
				url: 'files/satellite_data/get_landsat_link',
				method: 'GET',
				params: { ...adaptGetLandsatData(options) },
			}),
			async onQueryStarted(_, { queryFulfilled }) {
				try {
					await queryFulfilled;
				} catch (e) {
					if (__IS_DEV__) console.error(e);
				}
			},
		}),

		getLandsatPoint: build.mutation<string, ILandsatPointRequest>({
			query: (options) => ({
				url: 'files/satellite_data/get_temperature_at_point_landsat',
				method: 'GET',
				params: { ...options },
			}),
			transformResponse: (baseQueryReturnValue) => {
				const data = baseQueryReturnValue as number;
				return data.toFixed(2);
			},
		}),

		/** MONTHLY AVG */
		getMonthlyAvgDates: build.query<Array<string>, IMonthlyAvgAvailableDatesRequest>({
				query: ({ silent, ...options }) => ({
						url: 'files/satellite_data/get_available_dates_monthly_avg',
						method: 'GET',
						params: { ...options },
				}),
				async onQueryStarted(args, { queryFulfilled, dispatch }) {
						try {
								const response = await queryFulfilled;
								if (!response.data.length && !args?.silent) {
										dispatch(globalActions.setErrorMessage('Данные отсутствуют'));
								}
						} catch (e) {
								if (__IS_DEV__) console.error(e);
						}
			},
		}),

		getMonthlyAvgTileLink: build.mutation<IGetTileLinkResponse, ITileOptions>({
			query: (options) => ({
				url: 'files/satellite_data/get_monthly_avg_tiles',
				method: 'GET',
				params: { ...adaptGetMonthlyAvgData(options) },
			}),
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					const response = await queryFulfilled;

					dispatch(mapActions.setTileLink(response.data.link));
					dispatch(
						mapActions.setLegend({
							min: response.data.min_temp,
							max: response.data.max_temp,
						}),
					);
				} catch (e: any) {
					if (__IS_DEV__) console.error(e);

					if (e?.error?.status === 404) {
						dispatch(globalActions.setErrorMessage('Данные отсутствуют'));
					}
				}
			},
		}),

		getMonthlyAvgFile: build.mutation<string, ITileOptions>({
			query: (options) => ({
				url: 'files/satellite_data/get_monthly_avg_file_link',
				method: 'GET',
				params: { ...adaptGetMonthlyAvgData(options) },
			}),
			async onQueryStarted(_, { queryFulfilled }) {
				try {
					await queryFulfilled;
				} catch (e) {
					if (__IS_DEV__) console.error(e);
				}
			},
		}),

		getMonthlyAvgPoint: build.mutation<string, IMonthlyAvgPointRequest>({
			query: (options) => ({
				url: 'files/satellite_data/get_temperature_at_point_monthly_avg',
				method: 'GET',
				params: { ...options },
			}),
			transformResponse: (baseQueryReturnValue) => {
				const data = baseQueryReturnValue as number;
				return data.toFixed(2);
			},
		}),

		/** MONTHLY AVG MANY YEARS */
		getMonthlyAvgManyYearsDates: build.query<Array<string>, IMonthlyAvgAvailableDatesRequest>({
				query: ({ silent, ...options }) => ({
						url: 'files/satellite_data/get_available_dates_monthly_avg_many_years',
						method: 'GET',
						params: { ...options },
				}),
				async onQueryStarted(args, { queryFulfilled, dispatch }) {
						try {
								const response = await queryFulfilled;
								if (!response.data.length && !args?.silent) {
										dispatch(globalActions.setErrorMessage('Данные отсутствуют'));
								}
						} catch (e) {
								if (__IS_DEV__) console.error(e);
						}
			},
		}),

		getMonthlyAvgManyYearsTileLink: build.mutation<IGetTileLinkResponse, ITileOptions>({
			query: (options) => ({
				url: 'files/satellite_data/get_monthly_avg_many_years_tiles',
				method: 'GET',
				params: { ...adaptGetMonthlyAvgManyYearsData(options) },
			}),
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					const response = await queryFulfilled;

					dispatch(mapActions.setTileLink(response.data.link));
					dispatch(
						mapActions.setLegend({
							min: response.data.min_temp,
							max: response.data.max_temp,
						}),
					);
				} catch (e: any) {
					if (__IS_DEV__) console.error(e);

					if (e?.error?.status === 404) {
						dispatch(globalActions.setErrorMessage('Данные отсутствуют'));
					}
				}
			},
		}),

		getMonthlyAvgManyYearsFile: build.mutation<string, ITileOptions>({
			query: (options) => ({
				url: 'files/satellite_data/get_monthly_avg_many_years_file_link',
				method: 'GET',
				params: { ...adaptGetMonthlyAvgManyYearsData(options) },
			}),
			async onQueryStarted(_, { queryFulfilled }) {
				try {
					await queryFulfilled;
				} catch (e) {
					if (__IS_DEV__) console.error(e);
				}
			},
		}),

		getMonthlyAvgManyYearsPoint: build.mutation<
                        string,
                        IMonthlyAvgManyYearsPointRequest
                >({
                        query: (options) => ({
                                url: 'files/satellite_data/get_temperature_at_point_monthly_avg_many_years',
                                method: 'GET',
                                params: { ...options },
                        }),
                        transformResponse: (baseQueryReturnValue) => {
                                const data = baseQueryReturnValue as number;
                                return data.toFixed(2);
                        },
                }),

                /** CHLOROPHYLL */
                getChlorophyllAvailableDates: build.query<Array<string>, IChlorophyllAvailableDatesRequest>({
                        query: (options) => ({
                                url: 'files/ground_data/get_available_dates_chlorophyll_monthly_avg',
                                method: 'GET',
                                params: { ...options },
                        }),
                        async onQueryStarted(_, { queryFulfilled, dispatch }) {
                                try {
                                        const response = await queryFulfilled;
                                        if (!response.data.length) {
                                                dispatch(globalActions.setErrorMessage('Р”Р°РЅРЅС‹Рµ РѕС‚СЃСѓС‚СЃС‚РІСѓСЋС‚'));
                                        }
                                } catch (e) {
                                        if (__IS_DEV__) console.error(e);
                                }
                        },
                }),
                getChlorophyllTileLink: build.mutation<IGetTileLinkResponse, ITileOptions>({
                        query: (options) => ({
                                url: 'files/ground_data/get_chlorophyll_monthly_avg_tiles',
                                method: 'GET',
                                params: { ...adaptGetChlorophyllData(options) },
                        }),
                        async onQueryStarted(_, { queryFulfilled, dispatch }) {
                                try {
                                        const response = await queryFulfilled;

                                        dispatch(mapActions.setTileLink(response.data.link));

                                        const min =
                                                (response.data as Partial<IGetTileLinkResponse>).min_temp ??
                                                (response.data as { min?: number }).min;

                                        const max =
                                                (response.data as Partial<IGetTileLinkResponse>).max_temp ??
                                                (response.data as { max?: number }).max;

                                        if (typeof min === 'number' && typeof max === 'number') {
                                                dispatch(
                                                        mapActions.setLegend({
                                                                min,
                                                                max,
                                                        }),
                                                );
                                        } else {
                                                dispatch(mapActions.hideLegend());
                                        }
                                } catch (e: any) {
                                        if (__IS_DEV__) console.error(e);

                                        if (e?.error?.status === 404) {
                                                dispatch(globalActions.setErrorMessage('Данные отсутствуют'));
                                        }
                                }
                        },
                }),

                getChlorophyllFile: build.mutation<string, ITileOptions>({
                        query: (options) => ({
                                url: 'files/ground_data/get_chlorophyll_monthly_avg_file_link',
                                method: 'GET',
                                params: { ...adaptGetChlorophyllData(options) },
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
		getGroundDataAvailableDates: build.query<Array<string>, void>({
			query: () => ({
				url: 'files/ground_data/get_available_dates',
				method: 'GET',
			}),
			transformResponse: (baseQueryReturnValue) => {
				const data = baseQueryReturnValue as Array<string>;
				return !data.length ? [] : data;
			},
		}),

		getGroundDataParameters: build.query<
			Array<string>,
			IGroundDataParametersRequest
		>({
			query: (params) => ({
				url: 'files/ground_data/get_available_parameters',
				method: 'GET',
				params,
			}),
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
		}),

		getGroundDataPoints: build.query<Array<IGroundDataPoint>, IGroundDataRequest>({
			query: (params) => ({
				url: 'files/ground_data/get_points',
				method: 'GET',
				params,
			}),
			transformResponse: (baseQueryReturnValue) => {
				const data = baseQueryReturnValue as Array<IGroundDataPointDTO>;
				return data.map(adaptGroundDataPointDTO);
			},
		}),
	}),
});

const {
	useGetLandsatDatesQuery,
	useGetLandsatTileLinkMutation,
	useGetLandsatFileMutation,
	useGetLandsatPointMutation,
	useGetMonthlyAvgDatesQuery,
	useGetMonthlyAvgTileLinkMutation,
	useGetMonthlyAvgFileMutation,
	useGetMonthlyAvgPointMutation,
	useGetMonthlyAvgManyYearsDatesQuery,
	useGetMonthlyAvgManyYearsTileLinkMutation,
	useGetMonthlyAvgManyYearsFileMutation,
	useGetMonthlyAvgManyYearsPointMutation,
	useGetChlorophyllAvailableDatesQuery,
	useGetChlorophyllTileLinkMutation,
	useGetChlorophyllFileMutation,
	useGetGroundDataAvailableDatesQuery,
	useGetGroundDataParametersQuery,
	useGetGroundDataSourcesQuery,
	useGetGroundDataPointsQuery,
} = mapApi;

export {
	mapApi,
	useGetLandsatDatesQuery,
	useGetLandsatTileLinkMutation,
	useGetLandsatFileMutation,
	useGetLandsatPointMutation,
	useGetMonthlyAvgDatesQuery,
	useGetMonthlyAvgTileLinkMutation,
	useGetMonthlyAvgFileMutation,
	useGetMonthlyAvgPointMutation,
	useGetMonthlyAvgManyYearsDatesQuery,
	useGetMonthlyAvgManyYearsTileLinkMutation,
	useGetMonthlyAvgManyYearsFileMutation,
	useGetMonthlyAvgManyYearsPointMutation,
	useGetChlorophyllAvailableDatesQuery,
	useGetChlorophyllTileLinkMutation,
	useGetChlorophyllFileMutation,
	useGetGroundDataAvailableDatesQuery,
	useGetGroundDataParametersQuery,
	useGetGroundDataSourcesQuery,
	useGetGroundDataPointsQuery,
};
