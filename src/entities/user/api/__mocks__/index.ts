import { HttpResponse, delay, http } from 'msw';
import mockLoginResponse from './data/mockLoginResponse';
import mockProfileResponse from './data/mockProfileResponse';

const url = process.env.API_URL;

const authLogin = http.post(url + '/auth/login', async () => {
	await delay(3000);
	return HttpResponse.json(mockLoginResponse);
});

const authRegister = http.post(url + '/auth/register', async () => {
	await delay(3000);
	return HttpResponse.text('', { status: 200 });
});

const authProfile = http.get(url + '/auth/profile', async () => {
	await delay(3000);
	return HttpResponse.json(mockLoginResponse);
});

const authRefresh = http.get(url + '/auth/refresh', async () => {
	await delay(3000);
	return HttpResponse.json(mockProfileResponse);
});

const authLogout = http.get(url + '/auth/logout', async () => {
	await delay(3000);
	return HttpResponse.text('', { status: 200 });
});

export const authHandlers = [authLogin, authRegister, authProfile, authRefresh, authLogout];
