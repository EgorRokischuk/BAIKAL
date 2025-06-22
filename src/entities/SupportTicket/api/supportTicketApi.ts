import { globalActions } from '@/app/providers/store';
import { baseApi } from '@/shared/config/api/baseApi';
import { ISupportTicketRequest } from '../types';

const supportTicketApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		sendSupportTicket: build.mutation<string, ISupportTicketRequest>({
			query: (body) => {
				return { url: '/support-ticket', method: 'POST', body };
			},
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;

					dispatch(globalActions.setSuccessMessage('Тикет успешно отправлен!'));
				} catch (e) {
					if (__IS_DEV__) console.error(e);
					dispatch(
						globalActions.setErrorMessage('Не удалось отправить тикет. Повторите попытку позже.'),
					);
				}
			},
		}),
	}),
});

const { useSendSupportTicketMutation } = supportTicketApi;

export { supportTicketApi, useSendSupportTicketMutation };
