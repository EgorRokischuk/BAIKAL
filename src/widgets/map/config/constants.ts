import { LatLng, LatLngBounds } from 'leaflet';

interface IMapProps {
	center: LatLng;
	minZoom: number;
	maxBounds: LatLngBounds;
}

export const MAP_PROPS: IMapProps = {
	center: new LatLng(53.7, 107.7),
	minZoom: 3,
	maxBounds: new LatLngBounds(new LatLng(-110, -190), new LatLng(100, 200)),
};

export const LAYER_LINK = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

export const API = {
	TILE_DOMAIN: process.env.TILE_API_URL,
};
