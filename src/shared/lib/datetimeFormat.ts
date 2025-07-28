import { Dayjs } from 'dayjs';

export const convertToDateInput = (date: Dayjs | null): string => {
	if (!date || !date.isValid()) return undefined;
	return new Intl.DateTimeFormat('en-ca', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
	}).format(date.toDate());
};

export const convertToFullDateTime = (date: Dayjs | null): string => {
	if (!date || !date.isValid()) return undefined;
	return new Intl.DateTimeFormat('ru', {
		hour: '2-digit',
		minute: '2-digit',
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
	}).format(date.toDate());
};
