import { HttpResponse, delay, http } from 'msw';

const url = process.env.API_URL;

const mapGetTileLink = http.get(url + '/tile/get_link', async () => {
	await delay(3000);
	return HttpResponse.json(
		'/u/product/temperatura/landsat/8/Landsat_8_17_06_24/tiles/{z}/{x}/{-y}.png',
		{ status: 200 },
	);
});

const mapGetTifFileLink = http.get(url + '/files/get_link', async () => {
	await delay(3000);
	return HttpResponse.json('/u/product/temperatura/landsat/8/Landsat_8_17_06_24.tif', {
		status: 200,
	});
});

export const mapHandlers = [mapGetTileLink, mapGetTifFileLink];
