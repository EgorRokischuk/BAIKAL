import { globalActions } from '@/app/providers/store';
import { baseApi } from '@/shared/config/api/baseApi';
import { IPaginationRequest, IPaginationResponse } from '@/shared/types';
import { IExternalResourceRequest, IExternalResourceResponse } from '../types';

const externalResourceApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getExternalResourcesList: build.query<
			IPaginationResponse<IExternalResourceResponse>,
			IPaginationRequest
		>({
			query: (params) => ({
				url: '/external-resources',
				params: { page: 1, limit: 10, ...params },
			}),
		}),
		getExternalResourceById: build.query<IExternalResourceResponse, string>({
			query: (id) => `/external-resources/${id}`,
		}),
		createExternalResource: build.mutation<string, IExternalResourceRequest>({
			query: (body) => ({
				url: '/external-resources',
				method: 'POST',
				body,
			}),
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;

					dispatch(globalActions.setSuccessMessage('Внешний источник успешно создан!'));
				} catch (e) {
					if (__IS_DEV__) console.error(e);
					dispatch(
						globalActions.setErrorMessage(
							'Не удалось создать внешний источник. Повторите попытку позже.',
						),
					);
				}
			},
		}),
		updateExternalResource: build.mutation<void, IExternalResourceResponse>({
			query: (body) => ({
				url: `/external-resources/${body.id}`,
				method: 'PUT',
				body,
			}),
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;

					dispatch(globalActions.setSuccessMessage('Внешний источник успешно обновлен!'));
				} catch (e) {
					if (__IS_DEV__) console.error(e);
					dispatch(
						globalActions.setErrorMessage(
							'Не удалось обновить внешний источник. Повторите попытку позже.',
						),
					);
				}
			},
		}),
		deleteExternalResource: build.mutation<void, string>({
			query: (id) => ({
				url: `/external-resources/${id}`,
				method: 'DELETE',
			}),
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;

					dispatch(globalActions.setSuccessMessage('Внешний источник успешно удален!'));
				} catch (e) {
					if (__IS_DEV__) console.error(e);
					dispatch(
						globalActions.setErrorMessage(
							'Не удалось удалить внешний источник. Повторите попытку позже.',
						),
					);
				}
			},
		}),
	}),
});

const {
	useGetExternalResourcesListQuery,
	useGetExternalResourceByIdQuery,
	useCreateExternalResourceMutation,
	useUpdateExternalResourceMutation,
	useDeleteExternalResourceMutation,
} = externalResourceApi;

export {
	externalResourceApi,
	useGetExternalResourcesListQuery,
	useGetExternalResourceByIdQuery,
	useCreateExternalResourceMutation,
	useUpdateExternalResourceMutation,
	useDeleteExternalResourceMutation,
};
