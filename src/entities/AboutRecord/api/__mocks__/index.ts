import { HttpResponse, delay, http } from 'msw';
import mockAboutRecordByIdResponse from './data/mockAboutRecordByIdResponse';
import mockAboutRecordListResponse from './data/mockAboutRecordListResponse';

const url = process.env.API_URL;

const aboutRecordList = http.get(url + '/about-record', async () => {
	await delay(3000);
	return HttpResponse.json(mockAboutRecordListResponse, { status: 404 });
});

const aboutRecordById = http.get(url + '/about-record/:id', async () => {
	await delay(3000);
	return HttpResponse.json(mockAboutRecordByIdResponse);
});

const aboutRecordCreate = http.post(url + '/about-record', async () => {
	await delay(3000);
	return HttpResponse.json('9df0c6cc-3ee2-43b0-97be-f384d7f876d7', { status: 200 });
});

const aboutRecordUpdate = http.put(url + '/about-record/:id', async () => {
	await delay(3000);
	return HttpResponse.json('', { status: 200 });
});

const aboutRecordDelete = http.delete(url + '/about-record/:id', async () => {
	await delay(3000);
	return HttpResponse.json('', { status: 200 });
});

export const aboutRecordHandlers = [
	aboutRecordList,
	aboutRecordById,
	aboutRecordCreate,
	aboutRecordUpdate,
	aboutRecordDelete,
];
