import { LatLngLiteral } from 'leaflet';

export interface ITileOptions {
	type: string;
	parameter: string;
	device: string;
	date: string;
}

export interface IMapState {
	zoom: number;
	location: LatLngLiteral;
	date: string;
	isTileVisible: boolean;
	tileLink: string;
	tileOptions: Partial<ITileOptions>;
	tile: Array<string>;
}

export interface IMapMenuContent extends React.ReactElement {}

export interface IMapMenuItem {
	title: string;
	value?: string;
	level: number;
	content: IMapMenuContent;
}

export interface IMapMenu extends Array<IMapMenuItem> {}
