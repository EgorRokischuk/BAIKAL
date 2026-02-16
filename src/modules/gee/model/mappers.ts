import { toApiDate } from '@/shared/lib/date';
import type {
  GeePointPeriodResponseDto,
  GeePointRequest,
  GeePointResponse,
  GeePointResponseDto,
  GeePolygonPeriodResponseDto,
  GeePolygonRequest,
  GeePolygonResponse,
  GeePolygonResponseDto,
} from './types';

export const mapGeePointQuery = (payload: GeePointRequest) => ({
  lat: payload.point[0],
  lon: payload.point[1],
  date: toApiDate(payload.dateStart),
});

export const mapGeePointPeriodQuery = (payload: GeePointRequest) => ({
  lat: payload.point[0],
  lon: payload.point[1],
  start: toApiDate(payload.dateStart),
  end: toApiDate(payload.dateEnd ?? null),
});

export const mapGeePointResponse = (dto: GeePointResponseDto): GeePointResponse => ({
  lat: dto.lat,
  lon: dto.lon,
  dateStart: dto.date,
  value: dto['LST (°C)'],
});

export const mapGeePointPeriodResponse = (
  dto: GeePointPeriodResponseDto,
): GeePointResponse => ({
  lat: dto.lat,
  lon: dto.lon,
  dateStart: dto.start_date,
  dateEnd: dto.end_date,
  value: dto['Mean LST (°C)'],
});

export const mapGeePolygonQuery = (payload: GeePolygonRequest) => ({
  lat1: payload.shape[0].lat,
  lon1: payload.shape[0].lng,
  lat2: payload.shape[1].lat,
  lon2: payload.shape[1].lng,
  lat3: payload.shape[2].lat,
  lon3: payload.shape[2].lng,
  lat4: payload.shape[3].lat,
  lon4: payload.shape[3].lng,
  date: toApiDate(payload.dateStart),
});

export const mapGeePolygonPeriodQuery = (payload: GeePolygonRequest) => ({
  lat1: payload.shape[0].lat,
  lon1: payload.shape[0].lng,
  lat2: payload.shape[1].lat,
  lon2: payload.shape[1].lng,
  lat3: payload.shape[2].lat,
  lon3: payload.shape[2].lng,
  lat4: payload.shape[3].lat,
  lon4: payload.shape[3].lng,
  start_date: toApiDate(payload.dateStart),
  end_date: toApiDate(payload.dateEnd ?? null),
});

export const mapGeePolygonResponse = (
  dto: GeePolygonResponseDto,
): GeePolygonResponse => ({
  dateStart: dto.date,
  shape: dto.region,
  url: dto.download_url,
  note: dto.note,
});

export const mapGeePolygonPeriodResponse = (
  dto: GeePolygonPeriodResponseDto,
): GeePolygonResponse => ({
  dateStart: dto.start_date,
  dateEnd: dto.end_date,
  shape: dto.region,
  url: dto.download_url,
  note: dto.note,
});
