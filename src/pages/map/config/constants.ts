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
