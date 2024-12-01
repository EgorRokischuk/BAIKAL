import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { ShowCoordinates } from '@/features/Map/show-coordinates';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { ChangeZoom } from '@/features/Map/change-zoom';
import { getMapZoom } from '@/entities/map';

import { API, LAYER_LINK, MAP_PROPS } from '../config/constants';
import './Map.css';

const Map = () => {
	const zoom = useAppSelector(getMapZoom);

	return (
		<MapContainer zoom={zoom} zoomControl={false} doubleClickZoom={false} {...MAP_PROPS}>
			<TileLayer url={LAYER_LINK} />
			<TileLayer
				opacity={0.8}
				/* minZoom={8} maxZoom={12}  */
				url={`${API.TILE_DOMAIN}/temperature/landsat/Landsat_8_25_05_24/tiles/{z}/{x}/{-y}.png`} />
			<ChangeZoom />
			<ShowCoordinates />
		</MapContainer>
	);
};

export { Map };
