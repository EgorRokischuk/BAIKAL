import type { LatLngExpression } from 'leaflet';
import { BAIKAL_POLYGON } from './baikalPolygon';

export interface InterestObject {
  id: string;
  name: string;
  polygon: LatLngExpression[];
  visibilityMaxZoom: number;
  focusMaxZoom?: number;
}

export const INTEREST_OBJECTS: InterestObject[] = [
  {
    id: 'baikal',
    name: 'Lake Baikal',
    polygon: BAIKAL_POLYGON,
    visibilityMaxZoom: 5,
    focusMaxZoom: 9,
  },
];
