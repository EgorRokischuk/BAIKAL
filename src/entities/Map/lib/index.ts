import dayjs, { Dayjs } from 'dayjs';

export const initTileDay = (satellite: string, date: Dayjs): number | null => {
	if (satellite === 'landsat') return Number(dayjs(date).format('DD'));

	return undefined;
};

export const initTileYear = (photoType: string, date: Dayjs): number | null => {
	if (photoType === 'avgMonth') return undefined;

	return Number(dayjs(date).format('YYYY'));
};
