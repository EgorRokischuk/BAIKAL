import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { LAYER_LINK, MAP_PROPS } from '../config/constants';
import './Map.css';

const Map = () => {
	return (
		<MapContainer {...MAP_PROPS} zoomControl={false} doubleClickZoom={false}>
			<TileLayer url={LAYER_LINK} />
		</MapContainer>
	);
};

export { Map };
