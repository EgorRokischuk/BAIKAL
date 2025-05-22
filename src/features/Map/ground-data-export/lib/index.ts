import { IGroundDataPoint } from '@/entities/Map/types';

export const adaptExportGroundDataPoint = (
	data: Array<IGroundDataPoint>,
): Array<Record<string, unknown>> =>
	data.map((gdp) => ({
		...gdp,
	}));
