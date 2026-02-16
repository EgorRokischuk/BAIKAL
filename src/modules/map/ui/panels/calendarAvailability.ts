import dayjs, { type Dayjs } from 'dayjs';

export interface CalendarAvailabilityModel {
  items: Dayjs[];
  keys: Set<string>;
  years: Set<number>;
  months: Set<number>;
  monthsByYear: Map<number, Set<number>>;
  days: Set<string>;
  minDate: Dayjs | null;
  maxDate: Dayjs | null;
}

const sortAsc = (left: Dayjs, right: Dayjs) => left.valueOf() - right.valueOf();

export const isMonthOnlyType = (type: string) =>
  type === 'monthlyAvgManyYears' || type === 'chlorophyll';

export const getDateKey = (type: string, value: Dayjs | null) => {
  if (!value) return '';

  if (isMonthOnlyType(type)) {
    return value.format('MM');
  }

  if (type === 'monthlyAvg') {
    return value.format('YYYY-MM');
  }

  return value.format('YYYY-MM-DD');
};

export const formatDateLabel = (type: string, value: Dayjs | null) => {
  if (!value) return '-';

  if (isMonthOnlyType(type)) {
    return value.format('MM');
  }

  if (type === 'monthlyAvg') {
    return value.format('MM.YYYY');
  }

  return value.format('DD.MM.YYYY');
};

const parseLooseDate = (raw: string): Dayjs | null => {
  const value = raw.trim();
  if (!value) return null;

  const yearMonthLoose = value.match(/^(\d{4})[-/.](\d{1,2})$/);
  if (yearMonthLoose) {
    const [, year, month] = yearMonthLoose;
    const parsed = dayjs(`${year}-${month.padStart(2, '0')}-01`);
    return parsed.isValid() ? parsed : null;
  }

  const monthYearLoose = value.match(/^(\d{1,2})[./-](\d{4})$/);
  if (monthYearLoose) {
    const [, month, year] = monthYearLoose;
    const parsed = dayjs(`${year}-${month.padStart(2, '0')}-01`);
    return parsed.isValid() ? parsed : null;
  }

  const dottedDate = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (dottedDate) {
    const [, day, month, year] = dottedDate;
    const parsed = dayjs(`${year}-${month}-${day}`);
    return parsed.isValid() ? parsed : null;
  }

  const slashedDate = value.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
  if (slashedDate) {
    const [, year, month, day] = slashedDate;
    const parsed = dayjs(`${year}-${month}-${day}`);
    return parsed.isValid() ? parsed : null;
  }

  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
};

export const parseAvailableDate = (type: string, raw: string): Dayjs | null => {
  const value = raw.trim();
  if (!value) return null;

  if (isMonthOnlyType(type) && /^\d{1,2}$/.test(value)) {
    const parsed = dayjs(`2000-${value.padStart(2, '0')}-01`);
    return parsed.isValid() ? parsed : null;
  }

  if (type === 'monthlyAvg' && /^\d{4}-\d{2}$/.test(value)) {
    const parsed = dayjs(`${value}-01`);
    return parsed.isValid() ? parsed : null;
  }

  return parseLooseDate(value);
};

export const buildCalendarAvailability = (
  type: string,
  availableDates: string[],
): CalendarAvailabilityModel => {
  const uniqueByKey = new Map<string, Dayjs>();

  availableDates.forEach((raw) => {
    const parsed = parseAvailableDate(type, raw);
    if (!parsed || !parsed.isValid()) {
      return;
    }

    const key = getDateKey(type, parsed);
    if (!key || uniqueByKey.has(key)) {
      return;
    }

    uniqueByKey.set(key, parsed);
  });

  const items = [...uniqueByKey.values()].sort(sortAsc);
  const keys = new Set(items.map((item) => getDateKey(type, item)));
  const years = new Set(items.map((item) => item.year()));
  const months = new Set(items.map((item) => item.month() + 1));
  const days = new Set(items.map((item) => item.format('YYYY-MM-DD')));

  const monthsByYear = new Map<number, Set<number>>();
  items.forEach((item) => {
    const year = item.year();
    const month = item.month() + 1;

    if (!monthsByYear.has(year)) {
      monthsByYear.set(year, new Set<number>());
    }

    monthsByYear.get(year)?.add(month);
  });

  return {
    items,
    keys,
    years,
    months,
    monthsByYear,
    days,
    minDate: items[0] ?? null,
    maxDate: items[items.length - 1] ?? null,
  };
};

export const isDateAvailable = (type: string, value: Dayjs | null, keys: Set<string>) => {
  if (!value || !keys.size) {
    return false;
  }

  return keys.has(getDateKey(type, value));
};

