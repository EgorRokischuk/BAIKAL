import { globalActions } from '@/app/providers/store';
import { ApiTags } from '@/shared/config/api/apiTags';
import { baseApi } from '@/shared/config/api/baseApi';
import {
	adaptPublication,
	adaptPublicationDTO,
	adaptPublicationDTOList,
	IPublicationDTO,
} from '../lib/mappers';
import { IPublicationRequest, IPublicationResponse } from '../types';

const publicationApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getPublicationsList: build.query<Array<IPublicationResponse>, string | void>({
			query: (body) => ({
				url: '/publications',
				params: {
					search: typeof body === 'string' ? body : undefined,
				},
			}),
			providesTags: [ApiTags.PUBLICATION],
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;
				} catch (e) {
					if (__IS_DEV__) console.error(e);
					dispatch(globalActions.setErrorMessage('Не удалось получить записи.'));
				}
			},
			transformResponse: (baseQueryReturnValue) => {
				const data = baseQueryReturnValue as Array<IPublicationDTO>;

				return adaptPublicationDTOList(data);
			},
		}),
		getPublicationById: build.query<IPublicationResponse, string>({
			query: (id) => `/publications/${id}`,
			providesTags: (_result, _error, id) => [{ type: ApiTags.PUBLICATION, id }],
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;
				} catch (e) {
					if (__IS_DEV__) console.error(e);
					dispatch(globalActions.setErrorMessage('Не удалось получить запись.'));
				}
			},
			transformResponse: (baseQueryReturnValue) => {
				const data = baseQueryReturnValue as IPublicationDTO;

				return adaptPublicationDTO(data);
			},
		}),
		createPublication: build.mutation<string, IPublicationRequest>({
			query: (body) => {
				return { url: '/publications', method: 'POST', body: adaptPublication(body) };
			},
			invalidatesTags: [ApiTags.PUBLICATION],
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
		updatePublication: build.mutation<void, IPublicationResponse>({
			query: (body) => ({
				url: `/publications/${body.id}`,
				method: 'PUT',
				body: adaptPublication(body),
			}),
			invalidatesTags: [ApiTags.PUBLICATION],
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
		deletePublication: build.mutation<void, string>({
			query: (id) => ({
				url: `/publications/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: [ApiTags.PUBLICATION],
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
	useGetPublicationsListQuery,
	useLazyGetPublicationsListQuery,
	useGetPublicationByIdQuery,
	useCreatePublicationMutation,
	useUpdatePublicationMutation,
	useDeletePublicationMutation,
} = publicationApi;

export {
	publicationApi,
	useGetPublicationsListQuery,
	useLazyGetPublicationsListQuery,
	useGetPublicationByIdQuery,
	useCreatePublicationMutation,
	useUpdatePublicationMutation,
	useDeletePublicationMutation,
};
