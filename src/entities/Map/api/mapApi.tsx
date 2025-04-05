import dayjs from 'dayjs';
import { baseApi } from '@/shared/config/api/baseApi';
import { mapActions } from '../model/slices';
import { ITileOptions } from '../types';

interface ITileOptionsDTO {
	data_type: string;
	measured_parameter: string;
	measuring_device: string;
	year_id: string;
	month_id: string;
	day_id: string;
}

const adaptTileOptionsDTO = (options: ITileOptions): ITileOptionsDTO => ({
	data_type: options.type,
	measured_parameter: options.parameter,
	measuring_device: options.device,
	year_id: dayjs(options.date).format('YYYY'),
	month_id: dayjs(options.date).format('MM'),
	day_id: dayjs(options.date).format('DD'),
});

const mapApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getTileLink: build.query<string, ITileOptions>({
			query: (options) => ({
				url: 'tile/get_link',
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
		getTifFileLink: build.query<string, ITileOptions>({
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

const { useGetTileLinkQuery, useGetTifFileLinkQuery } = mapApi;

export { mapApi, useGetTileLinkQuery, useGetTifFileLinkQuery };
