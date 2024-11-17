import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { LAYER_LINK, MAP_PROPS } from '../config/constants';
import './Map.css';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { getMapZoom } from '@/entities/Map';

const Map = () => {
	const zoom = useAppSelector(getMapZoom);

	return (
		<MapContainer zoom={zoom} zoomControl={false} doubleClickZoom={false} {...MAP_PROPS}>
			<TileLayer url={LAYER_LINK} />
		</MapContainer>
	);
};

export { Map };
