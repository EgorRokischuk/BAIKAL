import { LatLngLiteral } from 'leaflet';

export interface IMapState {
	zoom: number;
	location: LatLngLiteral;
}
