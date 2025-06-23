import { HttpResponse, delay, http } from 'msw';
import mockPublicationByIdResponse from './data/mockPublicationByIdResponse';
import mockPublicationsListResponse from './data/mockPublicationsListResponse';

const url = process.env.API_URL;

const publicationsList = http.get(url + '/publications', async () => {
	await delay(3000);
	return HttpResponse.json(mockPublicationsListResponse, { status: 200 });
});

const publicationById = http.get(url + '/publications/:id', async () => {
	await delay(3000);
	return HttpResponse.json(mockPublicationByIdResponse, { status: 200 });
});

const publicationCreate = http.post(url + '/publications', async () => {
	await delay(3000);
	return HttpResponse.json('9df0c6cc-3ee2-43b0-97be-f384d7f876d7', { status: 200 });
});

const publicationUpdate = http.put(url + '/publications/:id', async () => {
	await delay(3000);
	return HttpResponse.json('', { status: 200 });
});

const publicationDelete = http.delete(url + '/publications/:id', async () => {
	await delay(3000);
	return HttpResponse.json('', { status: 200 });
});

export const publicationHandlers = [
	publicationsList,
	publicationById,
	publicationCreate,
	publicationUpdate,
	publicationDelete,
];
