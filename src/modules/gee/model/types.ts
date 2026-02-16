import type { Dayjs } from 'dayjs';
import type { LatLng } from 'leaflet';

export type GeeType = 'point' | 'polygon';

export interface GeeState {
  type: GeeType;
  dateStart: Dayjs | null;
  dateEnd: Dayjs | null;
  point: number[];
  value?: number;
  shape: LatLng[];
}

export interface GeePointRequest {
  dateStart: Dayjs | null;
  dateEnd?: Dayjs | null;
  point: number[];
}

export interface GeePointResponse {
  lat: number;
  lon: number;
  dateStart: string;
  dateEnd?: string;
  value: number;
}

export interface GeePolygonRequest {
  dateStart: Dayjs | null;
  dateEnd?: Dayjs | null;
  shape: LatLng[];
}

export interface GeePolygonResponse {
  dateStart: string;
  dateEnd?: string;
  shape: number[][];
  url: string;
  note: string;
}

export interface GeePointResponseDto {
  lat: number;
  lon: number;
  date: string;
  'LST (°C)': number;
}

export interface GeePointPeriodResponseDto {
  lat: number;
  lon: number;
  start_date: string;
  end_date: string;
  'Mean LST (°C)': number;
}

export interface GeePolygonResponseDto {
  date: string;
  region: number[][];
  download_url: string;
  note: string;
}

export interface GeePolygonPeriodResponseDto {
  start_date: string;
  end_date: string;
  region: number[][];
  download_url: string;
  note: string;
}
