import { globalActions } from '@/app/providers/store';
import { baseApi } from '@/shared/config/api/baseApi';
import { ISupportTicketRequest } from '../types';

const supportTicketApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		sendSupportTicket: build.mutation<string, ISupportTicketRequest>({
			query: (body) => {
				const formData = new FormData();
				formData.append('subject', body.subject);
				formData.append('description', body.description);
				formData.append('email', body.email);
				formData.append('file', body.file);

				console.log(body, formData);

				return { url: '/support-ticket', method: 'POST', body: formData };
			},
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;

					dispatch(globalActions.setSuccessMessage('Тикет успешно отправлен!'));
				} catch (e) {
					if (__IS_DEV__) console.error(e);
					dispatch(
						//globalActions.setErrorMessage('Не удалось отправить тикет. Повторите попытку позже.'),
						globalActions.setErrorMessage('Функция в разработке'),
					);
				}
			},
		}),
	}),
});

const { useSendSupportTicketMutation } = supportTicketApi;

export { supportTicketApi, useSendSupportTicketMutation };
