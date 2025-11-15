import { HttpResponse, delay, http } from 'msw';
import mockLoginResponse from './data/mockLoginResponse';
import mockProfileResponse from './data/mockProfileResponse';

const url = process.env.API_URL;

const authLogin = http.post(url + '/users/token', async () => {
	await delay(3000);
	return HttpResponse.json(mockLoginResponse);
});

const authRegister = http.post(url + '/users/register', async () => {
	await delay(3000);
	return HttpResponse.text('', { status: 200 });
});

const authProfile = http.get(url + '/users/me', async () => {
	await delay(3000);
	return HttpResponse.json(mockProfileResponse);
});

const authRefresh = http.get(url + '/users/refresh', async () => {
	await delay(3000);
	return HttpResponse.json(mockLoginResponse);
});

export const authHandlers = [authLogin, authRegister, authProfile, authRefresh];
