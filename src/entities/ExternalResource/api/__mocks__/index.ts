import { HttpResponse, delay, http } from 'msw';
import mockExternalResourceByIdResponse from './data/mockExternalResourceByIdResponse';
import mockExternalResourcesListResponse from './data/mockExternalResourcesListResponse';

const url = process.env.API_URL;

const externalResourceList = http.get(url + '/external-resources', async () => {
	await delay(3000);
	return HttpResponse.json(mockExternalResourcesListResponse);
});

const externalResourceById = http.get(url + '/external-resources/:id', async () => {
	await delay(3000);
	return HttpResponse.json(mockExternalResourceByIdResponse);
});

const externalResourceCreate = http.post(url + '/external-resources', async () => {
	await delay(3000);
	return HttpResponse.json('9df0c6cc-3ee2-43b0-97be-f384d7f876d7', { status: 200 });
});

const externalResourceUpdate = http.put(url + '/external-resources/:id', async () => {
	await delay(3000);
	return HttpResponse.json('', { status: 200 });
});

const externalResourceDelete = http.delete(url + '/external-resources/:id', async () => {
	await delay(3000);
	return HttpResponse.json('', { status: 200 });
});

export const externalResourceHandlers = [
	externalResourceList,
	externalResourceById,
	externalResourceCreate,
	externalResourceUpdate,
	externalResourceDelete,
];
