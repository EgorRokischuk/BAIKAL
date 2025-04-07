import dayjs from 'dayjs';
import { baseApi } from '@/shared/config/api/baseApi';
import { deviceDictionary, parameterDictionary, typeDictionary } from '../config/dictionaries';
import { mapActions } from '../model/slices';
import { ITileOptions } from '../types';

interface ITileOptionsDTO {
	data_type: string;
	measured_parameter: string;
	measuring_device: string;
	years_id: number;
	month_id: number;
	day_id: number;
}

const adaptTileOptionsDTO = (options: ITileOptions): ITileOptionsDTO => ({
	data_type: typeDictionary[options.type],
	measured_parameter: parameterDictionary[options.parameter],
	measuring_device: deviceDictionary[options.device],
	years_id: Number(dayjs(options.date).format('YYYY')),
	month_id: Number(dayjs(options.date).format('MM')),
	day_id: Number(dayjs(options.date).format('DD')),
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
	}),
});

const { useGetTileLinkMutation, useGetTifFileLinkMutation } = mapApi;

export { mapApi, useGetTileLinkMutation, useGetTifFileLinkMutation };
