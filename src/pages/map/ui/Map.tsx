import { MapContainer } from 'react-leaflet';
import { GroundDataPoints } from '@/widgets/ground-data-points';
import { MapMenu } from '@/widgets/map-menu';
import { MapTiles } from '@/widgets/map-tiles';
import { ChangeZoom } from '@/features/Map/change-zoom';
import { ShowCoordinates } from '@/features/Map/show-coordinates';
import { getMapZoom } from '@/entities/Map';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { MAP_PROPS } from '../config/constants';
import * as s from './Map.module.scss';

const Map: React.FC = () => {
	const zoom = useAppSelector(getMapZoom);

	return (
		<>
			<MapContainer zoom={zoom} zoomControl={false} doubleClickZoom={false} {...MAP_PROPS}>
				<MapTiles />
				<GroundDataPoints />

				<ChangeZoom />
				<ShowCoordinates />
			</MapContainer>
			<div className={s.menu_container}>
				<MapMenu />
			</div>
		</>
	);
};

export { Map };
