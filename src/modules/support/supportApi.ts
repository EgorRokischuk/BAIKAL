import { baseApi } from '@/api/baseApi';
import { appActions } from '@/store/slices/appSlice';
import type { SupportTicketPayload } from './model/types';

export const supportApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    sendSupportTicket: build.mutation<unknown, SupportTicketPayload>({
      query: (payload) => {
        const formData = new FormData();
        formData.append('subject', payload.subject);
        formData.append('description', payload.description);
        formData.append('email', payload.email);

        if (payload.file) {
          formData.append('file', payload.file);
        }

        return {
          url: '/support-ticket',
          method: 'POST',
          body: formData,
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(appActions.showSuccess('Ticket sent.'));
        } catch {
          dispatch(appActions.showWarning('Сервис поддержки пока недоступен.'));
        }
      },
    }),
  }),
});

export const { useSendSupportTicketMutation } = supportApi;
