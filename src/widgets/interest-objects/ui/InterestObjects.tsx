import { latLngBounds } from 'leaflet';
import { Polygon, Tooltip, useMap } from 'react-leaflet';
import { getMapZoom } from '@/entities/Map';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { INTEREST_OBJECTS } from '../config/constants';

const DEFAULT_PATH_OPTIONS = {
	color: '#4b5563',
	opacity: 0.75,
	weight: 1.75,
	fillOpacity: 0,
};

export const InterestObjects: React.FC = () => {
	const map = useMap();
	const zoom = useAppSelector(getMapZoom);

	return (
		<>
			{INTEREST_OBJECTS.filter((object) => zoom <= object.visibilityMaxZoom).map((object) => {
				const bounds = latLngBounds(object.polygon);

				const handleFocus = () => {
					map.fitBounds(bounds, {
						padding: [24, 24],
						maxZoom: object.focusMaxZoom ?? 9,
					});
				};

				return (
					<Polygon
						key={object.id}
						positions={object.polygon}
						pathOptions={DEFAULT_PATH_OPTIONS}
						eventHandlers={{
							click: handleFocus,
						}}
					>
						<Tooltip sticky direction="center">
							{object.name}
						</Tooltip>
					</Polygon>
				);
			})}
		</>
	);
};
