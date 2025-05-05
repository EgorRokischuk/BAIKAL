import { HttpResponse, delay, http } from 'msw';
import mockGroundDataParametersResponse from './data/mockGroundDataParametersResponse';
import mockGroundDataPointsResponse from './data/mockGroundDataPointsResponse';
import mockGroundDataSourcesResponse from './data/mockGroundDataSourcesResponse';

const url = process.env.API_URL;

const mapGetTileLink = http.get(url + '/files/get_tiles', async () => {
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

const mapGetGroundDataParameters = http.get(
	url + '/files/ground_data/get_available_parameters',
	async () => {
		await delay(3000);
		return HttpResponse.json(mockGroundDataParametersResponse, {
			status: 200,
		});
	},
);

const mapGetGroundDataSources = http.get(
	url + '/files/ground_data/get_available_sources',
	async () => {
		await delay(3000);
		return HttpResponse.json(mockGroundDataSourcesResponse, {
			status: 200,
		});
	},
);

const mapGetGroundDataPoints = http.get(
	url + '/files/ground_data/get_available_parameters',
	async () => {
		await delay(3000);
		return HttpResponse.json(mockGroundDataPointsResponse, {
			status: 200,
		});
	},
);

export const mapHandlers = [
	mapGetTileLink,
	mapGetTifFileLink,
	mapGetGroundDataParameters,
	mapGetGroundDataSources,
	mapGetGroundDataPoints,
];
