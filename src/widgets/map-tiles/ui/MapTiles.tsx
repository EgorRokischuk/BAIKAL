import { TileLayer } from 'react-leaflet';
import { getTileLink, getTileOptions } from '@/entities/Map';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { API, DARK_LAYER_LINK, LAYER_LINK } from '../config/constants';

export const MapTiles: React.FC = () => {
        const tileLink = useAppSelector(getTileLink);
        const tileOptions = useAppSelector(getTileOptions);

        const isChlorophyll = tileOptions.parameter === 'chlorophyll';

        const baseLayerLink = isChlorophyll ? DARK_LAYER_LINK : LAYER_LINK;
        const baseLayerOpacity = isChlorophyll ? 0.9 : 1;

        return (
                <>
                        <TileLayer opacity={baseLayerOpacity} url={baseLayerLink} />
                        {tileLink && (
                                <TileLayer opacity={0.8} minZoom={5} maxZoom={12} url={`${API.TILE_DOMAIN}${tileLink}`} />
                        )}
                </>
        );
};
