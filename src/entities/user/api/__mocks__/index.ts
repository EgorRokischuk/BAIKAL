import { HttpResponse, http } from 'msw';
import mockLoginResponse from './data/mockLoginResponse';
import mockProfileResponse from './data/mockProfileResponse';

// TODO
const url = 'http://localhost:3000/api';

const authLogin = http.post(url + '/auth/login', () => {
	return HttpResponse.json(mockLoginResponse);
});

const authRegister = http.get(url + '/auth/register', () => {
	return HttpResponse.text('', { status: 200 });
});

const authProfile = http.get(url + '/auth/profile', () => {
	return HttpResponse.json(mockLoginResponse);
});

const authRefresh = http.get(url + '/auth/refresh', () => {
	return HttpResponse.json(mockProfileResponse);
});

const authLogout = http.get(url + '/auth/logout', () => {
	return HttpResponse.text('', { status: 200 });
});

export const authHandlers = [authLogin, authRegister, authProfile, authRefresh, authLogout];
