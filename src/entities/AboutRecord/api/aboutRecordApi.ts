import { globalActions } from '@/app/providers/store';
import { ApiTags } from '@/shared/config/api/apiTags';
import { baseApi } from '@/shared/config/api/baseApi';
import { IAboutRecordRequest, IAboutRecordResponse } from '../types';

const aboutRecordApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getAboutRecordsList: build.query<Array<IAboutRecordResponse>, void>({
			query: () => ({
				url: '/about-record',
			}),
			providesTags: [ApiTags.ABOUT_RECORD],
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;
				} catch (e) {
					if (__IS_DEV__) console.error(e);
					dispatch(globalActions.setErrorMessage('Не удалось получить записи.'));
				}
			},
		}),
		getAboutRecordById: build.query<IAboutRecordResponse, string>({
			query: (id) => `/about-record/${id}`,
			providesTags: (_result, _error, id) => [{ type: ApiTags.ABOUT_RECORD, id }],
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;
				} catch (e) {
					if (__IS_DEV__) console.error(e);
					dispatch(globalActions.setErrorMessage('Не удалось получить запись.'));
				}
			},
		}),
		createAboutRecord: build.mutation<string, IAboutRecordRequest>({
			query: (body) => {
				return { url: '/about-record', method: 'POST', body };
			},
			invalidatesTags: [ApiTags.ABOUT_RECORD],
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;

					dispatch(globalActions.setSuccessMessage('Запись успешно создана!'));
				} catch (e) {
					if (__IS_DEV__) console.error(e);
					dispatch(
						globalActions.setErrorMessage('Не удалось создать запись. Повторите попытку позже.'),
					);
				}
			},
		}),
		updateAboutRecord: build.mutation<void, IAboutRecordResponse>({
			query: (body) => ({
				url: `/about-record/${body.id}`,
				method: 'PUT',
				body,
			}),
			invalidatesTags: [ApiTags.ABOUT_RECORD],
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;

					dispatch(globalActions.setSuccessMessage('Запись успешно обновлена!'));
				} catch (e) {
					if (__IS_DEV__) console.error(e);
					dispatch(
						globalActions.setErrorMessage('Не удалось обновить запись. Повторите попытку позже.'),
					);
				}
			},
		}),
		deleteAboutRecord: build.mutation<void, string>({
			query: (id) => ({
				url: `/about-record/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: [ApiTags.ABOUT_RECORD],
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;

					dispatch(globalActions.setSuccessMessage('Запись успешно удалена!'));
				} catch (e) {
					if (__IS_DEV__) console.error(e);
					dispatch(
						globalActions.setErrorMessage('Не удалось удалить запись. Повторите попытку позже.'),
					);
				}
			},
		}),
	}),
});

const {
	useGetAboutRecordsListQuery,
	useGetAboutRecordByIdQuery,
	useCreateAboutRecordMutation,
	useUpdateAboutRecordMutation,
	useDeleteAboutRecordMutation,
} = aboutRecordApi;

export {
	aboutRecordApi,
	useGetAboutRecordsListQuery,
	useGetAboutRecordByIdQuery,
	useCreateAboutRecordMutation,
	useUpdateAboutRecordMutation,
	useDeleteAboutRecordMutation,
};
