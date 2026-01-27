import type { LatLngExpression } from 'leaflet';
import { BAIKAL_POLYGON } from './baikalPolygon';

export interface IInterestObject {
	id: string;
	name: string;
	polygon: LatLngExpression[];
	visibilityMaxZoom: number;
	focusMaxZoom?: number;
}

export const INTEREST_OBJECTS: IInterestObject[] = [
	{
		id: 'baikal',
		name: 'Озеро Байкал',
		polygon: BAIKAL_POLYGON,
		visibilityMaxZoom: 5,
		focusMaxZoom: 9,
	},
];
