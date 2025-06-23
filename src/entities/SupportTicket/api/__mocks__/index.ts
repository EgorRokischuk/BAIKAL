import { HttpResponse, delay, http } from 'msw';

const url = process.env.API_URL;

const supportTicketSend = http.post(url + '/support-ticket', async () => {
	await delay(3000);
	return HttpResponse.json('', { status: 200 });
});

export const supportTicketHandlers = [supportTicketSend];
