import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { ShowCoordinates } from '@/features/Map/show-coordinates';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { ChangeZoom } from '@/features/Map/change-zoom';
import { getIsTileVisible, getMapZoom, getTile, getTileDate } from '@/entities/Map';

import { API, LAYER_LINK, MAP_PROPS } from '../config/constants';
import './Map.css';

const Map: React.FC = () => {
	const zoom = useAppSelector(getMapZoom);
	const isTileVisible = useAppSelector(getIsTileVisible);
	const tile = useAppSelector(getTile);
	const tileDate = useAppSelector(getTileDate);

	return (
		<MapContainer zoom={zoom} zoomControl={false} doubleClickZoom={false} {...MAP_PROPS}>
			<TileLayer url={LAYER_LINK} />
			{isTileVisible && (
				<TileLayer
					opacity={0.8}
					minZoom={8}
					maxZoom={12}
					url={`${API.TILE_DOMAIN}/${tile.filter((t) => !!t).join('/')}_${tileDate}/tiles/{z}/{x}/{-y}.png`}
				/>
			)}

			<ChangeZoom />
			<ShowCoordinates />
		</MapContainer>
	);
};

export { Map };
