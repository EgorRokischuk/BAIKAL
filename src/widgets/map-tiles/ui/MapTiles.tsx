import { TileLayer } from 'react-leaflet';
import { getTileLink } from '@/entities/Map';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { API, LAYER_LINK } from '../config/constants';

export const MapTiles: React.FC = () => {
	const tileLink = useAppSelector(getTileLink);

	return (
		<>
			<TileLayer url={LAYER_LINK} />
			{tileLink && (
				<TileLayer opacity={0.8} minZoom={8} maxZoom={12} url={`${API.TILE_DOMAIN}${tileLink}`} />
			)}
		</>
	);
};
