import { baseApi } from '@/api/baseApi';
import { ApiTag } from '@/api/tags';
import { appActions } from '@/store/slices/appSlice';
import { mapPublicationDto, mapPublicationPayload } from './model/mappers';
import type { Publication, PublicationDto, PublicationPayload } from './model/types';

export const publicationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPublications: build.query<Publication[], string | void>({
      query: (search) => ({
        url: '/publications/',
        method: 'GET',
        params: {
          search: typeof search === 'string' ? search : undefined,
        },
      }),
      providesTags: [ApiTag.Publication],
      transformResponse: (data: PublicationDto[]) => data.map(mapPublicationDto),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          dispatch(appActions.showError('Failed to load publications.'));
        }
      },
    }),
    createPublication: build.mutation<unknown, PublicationPayload>({
      query: (payload) => ({
        url: '/publications',
        method: 'POST',
        body: mapPublicationPayload(payload),
      }),
      invalidatesTags: [ApiTag.Publication],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(appActions.showSuccess('Publication created.'));
        } catch {
          dispatch(appActions.showError('Failed to create publication.'));
        }
      },
    }),
    updatePublication: build.mutation<void, Publication>({
      query: (payload) => ({
        url: `/publications/${payload.id}`,
        method: 'PUT',
        body: mapPublicationPayload(payload),
      }),
      invalidatesTags: [ApiTag.Publication],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(appActions.showSuccess('Publication updated.'));
        } catch {
          dispatch(appActions.showError('Failed to update publication.'));
        }
      },
    }),
    deletePublication: build.mutation<void, string>({
      query: (id) => ({
        url: `/publications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [ApiTag.Publication],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(appActions.showSuccess('Publication deleted.'));
        } catch {
          dispatch(appActions.showError('Failed to delete publication.'));
        }
      },
    }),
  }),
});

export const {
  useGetPublicationsQuery,
  useCreatePublicationMutation,
  useUpdatePublicationMutation,
  useDeletePublicationMutation,
} = publicationsApi;
