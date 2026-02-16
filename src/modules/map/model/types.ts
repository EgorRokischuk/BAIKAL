import type { Dayjs } from 'dayjs';
import type { LatLngLiteral } from 'leaflet';

export type TileType = '' | 'landsat' | 'monthlyAvg' | 'monthlyAvgManyYears' | 'chlorophyll' | 'groundData';
export type ProductType = 'baikalRiver' | 'gee' | 'groundData';
export type TileParameter = 'temperature' | 'chlorophyll' | 'transparency' | '';
export type TileSource = 'viirs' | 'terra' | 'aqua' | 'landsat' | 'sentinel' | '';
export type PhotoTime = 'daily' | 'nightly' | 'diurnal' | null;
export type BaseMapId = 'osm' | 'cartoLight' | 'cartoDark' | 'topo' | 'satellite';

export interface TileOptions {
  type: TileType;
  productType: ProductType;
  parameter: TileParameter | string;
  source: TileSource | string;
  photoTime: PhotoTime;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

export interface MapLegend {
  min: number | null;
  max: number | null;
  visible: boolean;
}

export interface MapCompareState {
  enabled: boolean;
  leftDate: Dayjs | null;
  rightDate: Dayjs | null;
  leftTileLink: string;
  rightTileLink: string;
}

export interface MapState {
  zoom: number;
  location: LatLngLiteral;
  baseMapId: BaseMapId;
  isPointsVisible: boolean;
  tileLink: string;
  tileOpacity: number;
  legend: MapLegend;
  tileOptions: TileOptions;
  compare: MapCompareState;
}

export interface GetTileLinkResponse {
  link: string;
  min_temp?: number;
  max_temp?: number;
  min?: number;
  max?: number;
}

interface BaseSatelliteRequest {
  data_type: string;
  parameter: string;
  device: string;
}

interface BasePointRequest {
  lon: number;
  lat: number;
}

export interface LandsatAvailableDatesRequest extends BaseSatelliteRequest {
  lst_num?: string;
}

export interface LandsatRequest extends BaseSatelliteRequest {
  years_id: number;
  month_id: number;
  day_id: number;
  time_of_day?: string;
}

export interface LandsatPointRequest extends LandsatRequest, BasePointRequest {}

export interface MonthlyAvgAvailableDatesRequest extends BaseSatelliteRequest {
  time_of_day: string;
  silent?: boolean;
}

export interface MonthlyAvgRequest extends BaseSatelliteRequest {
  years_id: number;
  month_id: number;
  time_of_day: string;
}

export interface MonthlyAvgPointRequest extends MonthlyAvgRequest, BasePointRequest {}

export interface MonthlyAvgManyYearsAvailableDatesRequest extends BaseSatelliteRequest {
  time_of_day: string;
  silent?: boolean;
}

export interface MonthlyAvgManyYearsRequest extends BaseSatelliteRequest {
  month_id: number;
  time_of_day: string;
}

export interface MonthlyAvgManyYearsPointRequest
  extends MonthlyAvgManyYearsRequest,
    BasePointRequest {}

export interface ChlorophyllAvailableDatesRequest {
  data_type: string;
  device: string;
  parameter?: string;
}

export interface ChlorophyllRequest {
  data_type: string;
  device: string;
  month_id: number;
}

export interface GroundDataParameterRequest {
  startDate: string;
  endDate?: string;
}

export interface GroundDataSourceRequest extends GroundDataParameterRequest {
  parameter: string;
}

export interface GroundDataRequest extends GroundDataSourceRequest {
  source: string;
}

export interface GroundDataPoint {
  date: Date;
  latitude: number;
  longitude: number;
  value: string;
  sensor: string;
}

export interface GroundDataPointDto {
  coordinates: [number, number];
  value: number;
  unit: string;
  sensor: string;
  date_time: string;
}
