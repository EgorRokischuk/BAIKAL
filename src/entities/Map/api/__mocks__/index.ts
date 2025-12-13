import { HttpResponse, delay, http } from 'msw';
import mockGroundDataAvaialbleDatesResponse from './data/mockGroundDataAvaialbleDatesResponse';
import mockGroundDataParametersResponse from './data/mockGroundDataParametersResponse';
import mockGroundDataPointsResponse from './data/mockGroundDataPointsResponse';
import mockGroundDataSourcesResponse from './data/mockGroundDataSourcesResponse';
import mockLandsatAvailableDatesResponse from './data/mockLandsatAvailableDatesResponse';
import mockMonthlyAvgAvailableDatesResponse from './data/mockMonthlyAvgAvailableDatesResponse';
import mockMonthlyAvgManyYearsAvailableDatesResponse from './data/mockMonthlyAvgManyYearsAvailableDatesResponse';

const url = process.env.API_URL;

const mapGetLandsatAvailableDates = http.get(
	url + '/files/satellite_data/get_available_dates_landsat',
	async () => {
		await delay(3000);
		return HttpResponse.json(mockLandsatAvailableDatesResponse, { status: 200 });
	},
);

const mapGetMonthlyAvgAvailableDates = http.get(
	url + '/files/satellite_data/get_available_dates_monthly_avg',
	async () => {
		await delay(3000);
		return HttpResponse.json(mockMonthlyAvgAvailableDatesResponse, { status: 200 });
	},
);

const mapGetMonthlyAvgManyYearsAvailableDates = http.get(
	url + '/files/satellite_data/get_available_dates_monthly_avg_many_years',
	async () => {
		await delay(3000);
		return HttpResponse.json(mockMonthlyAvgManyYearsAvailableDatesResponse, { status: 200 });
	},
);

const mapGetTileLink = http.get(
	new RegExp(String.raw`${url}/files/satellite_data/get_.+_tiles`),
	async () => {
		await delay(3000);
		return HttpResponse.json(
			'/u/product/temperatura/landsat/8/Landsat_8_17_06_24/tiles/{z}/{x}/{-y}.png',
			{ status: 200 },
		);
	},
);

const mapGetFileLink = http.get(
	new RegExp(String.raw`${url}/files/satellite_data/get_.+_link`),
	async () => {
		await delay(3000);
		return HttpResponse.json('/u/product/temperatura/landsat/8/Landsat_8_17_06_24.tif', {
			status: 200,
		});
	},
);

const mapGetPoint = http.get(
	new RegExp(String.raw`${url}/files/satellite_data/get_temperature_at_point_.+`),
	async () => {
		await delay(3000);
		return HttpResponse.json(-4.432432, { status: 200 });
	},
);

const mapGetGroundDataAvailableDates = http.get(
	url + '/files/ground_data/get_available_dates',
	async () => {
		await delay(3000);
		return HttpResponse.json(mockGroundDataAvaialbleDatesResponse, { status: 200 });
	},
);

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

const mapGetGroundDataPoints = http.get(url + '/files/ground_data/get_points', async () => {
        await delay(3000);
        return HttpResponse.json(mockGroundDataPointsResponse, {
                status: 200,
        });
});

const mapGetChlorophyllLink = http.get(url + '/files/ground_data/get_chlorofill_link', async () => {
        await delay(3000);
        return HttpResponse.json(
                {
                        link: '/u/product/chlorophyll/tiles/{z}/{x}/{-y}.png',
                        min_temp: 0,
                        max_temp: 30,
                },
                { status: 200 },
        );
});

export const mapHandlers = [
        mapGetLandsatAvailableDates,
        mapGetMonthlyAvgAvailableDates,
        mapGetMonthlyAvgManyYearsAvailableDates,
        mapGetTileLink,
        mapGetFileLink,
        mapGetPoint,
        mapGetGroundDataParameters,
        mapGetGroundDataSources,
        mapGetGroundDataPoints,
        mapGetGroundDataAvailableDates,
        mapGetChlorophyllLink,
];
