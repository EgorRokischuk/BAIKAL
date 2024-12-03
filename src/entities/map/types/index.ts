import { LatLngLiteral } from 'leaflet';

export interface IMapState {
	zoom: number;
	location: LatLngLiteral;
}

export interface IMapMenuContent extends React.ReactElement {}

export interface IMapMenuItem {
	title: string;
	value?: string;
	level: number;
	content: IMapMenuContent;
}

export interface IMapMenu extends Array<IMapMenuItem> {}
