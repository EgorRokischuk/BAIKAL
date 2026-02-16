import { baseApi } from '@/api/baseApi';
import { ApiTag } from '@/api/tags';
import { appActions } from '@/store/slices/appSlice';
import type { PaginationRequest } from '@/shared/types/common';
import type { ExternalResource, ExternalResourcePayload } from './model/types';

interface ExternalResourceDto {
  id?: string | number;
  title?: string | null;
  name_service?: string | null;
  link?: string | null;
  url_reference?: string | null;
  resource_url?: string | null;
  href?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;
  image?: string | null;
  preview?: string | null;
  preview_url?: string | null;
  thumbnail?: string | null;
  thumbnail_url?: string | null;
}

const mapExternalResourceDto = (dto: ExternalResourceDto, index: number): ExternalResource => ({
  id: String(dto.id ?? `resource-${index + 1}`),
  title: dto.title ?? dto.name_service ?? `Ресурс ${index + 1}`,
  link: dto.link ?? dto.url_reference ?? dto.resource_url ?? dto.href ?? '',
  imageUrl:
    dto.imageUrl ??
    dto.image_url ??
    dto.preview ??
    dto.preview_url ??
    dto.thumbnail ??
    dto.thumbnail_url ??
    dto.image ??
    '',
});

export const externalResourcesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getExternalResources: build.query<ExternalResource[], PaginationRequest | void>({
      query: () => ({
        url: '/external_resources/get_resources',
        method: 'GET',
      }),
      transformResponse: (data: ExternalResourceDto[]) =>
        Array.isArray(data) ? data.map(mapExternalResourceDto) : [],
      providesTags: [ApiTag.ExternalResource],
    }),
    createExternalResource: build.mutation<unknown, ExternalResourcePayload>({
      query: (payload) => {
        const formData = new FormData();
        formData.append('title', payload.title);
        formData.append('link', payload.link);

        if (payload.image) {
          formData.append('image', payload.image);
        }

        return {
          url: '/external-resources',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: [ApiTag.ExternalResource],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(appActions.showSuccess('Resource created.'));
        } catch {
          dispatch(appActions.showError('Failed to create resource.'));
        }
      },
    }),
    updateExternalResource: build.mutation<void, ExternalResource>({
      query: (payload) => ({
        url: `/external-resources/${payload.id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: [ApiTag.ExternalResource],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(appActions.showSuccess('Resource updated.'));
        } catch {
          dispatch(appActions.showError('Failed to update resource.'));
        }
      },
    }),
    deleteExternalResource: build.mutation<void, string>({
      query: (id) => ({
        url: `/external-resources/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [ApiTag.ExternalResource],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(appActions.showSuccess('Resource deleted.'));
        } catch {
          dispatch(appActions.showError('Failed to delete resource.'));
        }
      },
    }),
  }),
});

export const {
  useGetExternalResourcesQuery,
  useCreateExternalResourceMutation,
  useUpdateExternalResourceMutation,
  useDeleteExternalResourceMutation,
} = externalResourcesApi;
