import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ChangeZoom } from '@/features/Map/change-zoom';
import { ShowCoordinates } from '@/features/Map/show-coordinates';
import { getIsTileVisible, getMapZoom, getTileLink } from '@/entities/Map';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { API, LAYER_LINK, MAP_PROPS } from '../config/constants';
import './Map.css';

const Map: React.FC = () => {
	const zoom = useAppSelector(getMapZoom);
	const isTileVisible = useAppSelector(getIsTileVisible);
	const tileLink = useAppSelector(getTileLink);

	return (
		<MapContainer zoom={zoom} zoomControl={false} doubleClickZoom={false} {...MAP_PROPS}>
			<TileLayer url={LAYER_LINK} />
			{isTileVisible && tileLink && (
				<TileLayer opacity={0.8} minZoom={8} maxZoom={12} url={`${API.TILE_DOMAIN}${tileLink}`} />
			)}

			<ChangeZoom />
			<ShowCoordinates />
		</MapContainer>
	);
};

export { Map };
