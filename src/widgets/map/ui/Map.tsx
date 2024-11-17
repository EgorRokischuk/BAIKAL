import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { ChangeZoom } from '@/features/Map/change-zoom';
import { getMapZoom } from '@/entities/Map';

import { LAYER_LINK, MAP_PROPS } from '../config/constants';
import './Map.css';

const Map = () => {
	const zoom = useAppSelector(getMapZoom);

	return (
		<MapContainer zoom={zoom} zoomControl={false} doubleClickZoom={false} {...MAP_PROPS}>
			<TileLayer url={LAYER_LINK} />

			<ChangeZoom />
		</MapContainer>
	);
};

export { Map };
