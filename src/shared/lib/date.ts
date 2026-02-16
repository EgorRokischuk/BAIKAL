import type { Dayjs } from 'dayjs';

export const toApiDate = (date: Dayjs | null | undefined): string | undefined => {
  if (!date || !date.isValid()) return undefined;

  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date.toDate());
};

export const toDisplayDateTime = (date: Dayjs | null | undefined): string => {
  if (!date || !date.isValid()) return '';

  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date.toDate());
};
