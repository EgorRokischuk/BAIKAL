import { MapContainer } from 'react-leaflet';
import { GroundDataPoints } from '@/widgets/ground-data-points';
import { MapMenu } from '@/widgets/map-menu';
import { MapTiles } from '@/widgets/map-tiles';
import { SetPointLocation } from '@/features/GEE/point-location-set';
import { ChangeZoom } from '@/features/Map/change-zoom';
import { GetPointValue } from '@/features/Map/get-point-value';
import { ShowCoordinates } from '@/features/Map/show-coordinates';
import { GeeShape, PointInfo } from '@/entities/GEE';
import { getMapZoom } from '@/entities/Map';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { MAP_PROPS } from '../config/constants';
import { MapLegend } from '@/widgets/map-legend/ui/MapLegend';
import * as s from './Map.module.scss';

const Map: React.FC = () => {
	const zoom = useAppSelector(getMapZoom);

	return (
		<>
			<MapContainer zoom={zoom} zoomControl={false} doubleClickZoom={false} {...MAP_PROPS}>
				<MapLegend />
				<MapTiles />
				<GroundDataPoints />

				<ChangeZoom />
				<ShowCoordinates />

				<GetPointValue />

				{/** GEE */}
				<SetPointLocation />
				<PointInfo />
				<GeeShape />
			</MapContainer>
			<div className={s.menu_container}>
				<MapMenu />
			</div>
		</>
	);
};

export { Map };
