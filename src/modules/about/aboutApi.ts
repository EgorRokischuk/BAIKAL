import { baseApi } from '@/api/baseApi';
import { ApiTag } from '@/api/tags';
import { appActions } from '@/store/slices/appSlice';
import type { AboutRecord, AboutRecordPayload } from './model/types';

export const aboutApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAboutRecords: build.query<AboutRecord[], void>({
      query: () => ({
        url: '/about-record',
        method: 'GET',
      }),
      providesTags: [ApiTag.AboutRecord],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          dispatch(appActions.showError('Failed to load records.'));
        }
      },
    }),
    createAboutRecord: build.mutation<unknown, AboutRecordPayload>({
      query: (payload) => ({
        url: '/about-record',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [ApiTag.AboutRecord],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(appActions.showSuccess('Record created.'));
        } catch {
          dispatch(appActions.showError('Failed to create record.'));
        }
      },
    }),
    updateAboutRecord: build.mutation<void, AboutRecord>({
      query: (payload) => ({
        url: `/about-record/${payload.id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: [ApiTag.AboutRecord],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(appActions.showSuccess('Record updated.'));
        } catch {
          dispatch(appActions.showError('Failed to update record.'));
        }
      },
    }),
    deleteAboutRecord: build.mutation<void, string>({
      query: (id) => ({
        url: `/about-record/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [ApiTag.AboutRecord],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(appActions.showSuccess('Record deleted.'));
        } catch {
          dispatch(appActions.showError('Failed to delete record.'));
        }
      },
    }),
  }),
});

export const {
  useGetAboutRecordsQuery,
  useCreateAboutRecordMutation,
  useUpdateAboutRecordMutation,
  useDeleteAboutRecordMutation,
} = aboutApi;
