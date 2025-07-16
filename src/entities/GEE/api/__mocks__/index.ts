import { HttpResponse, delay, http } from 'msw';
import mockGeePointPeriodValueResponse from './data/mockGeePointPeriodValueResponse';
import mockGeePointValueResponse from './data/mockGeePointValueResponse';

const url = process.env.API_URL;

const geeGetPointValue = http.get(url + '/api/v1/gee/lst/point/date/', async () => {
	await delay(3000);
	return HttpResponse.json(mockGeePointValueResponse, { status: 200 });
});

const geeGetPointPeriodValue = http.get(url + '/api/v1/gee/lst/period/', async () => {
	await delay(3000);
	return HttpResponse.json(mockGeePointPeriodValueResponse, { status: 200 });
});

export const geeHandlers = [geeGetPointValue, geeGetPointPeriodValue];
