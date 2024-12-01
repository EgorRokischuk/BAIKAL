import { useMapEvent } from 'react-leaflet';
import { LatLngLiteral } from 'leaflet';

import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { getMapLocation, mapActions } from '@/entities/map';
import { DragControl } from '@/shared/ui';

import * as s from './ShowCoordinates.module.scss';
import { convertLocation } from '../lib';

function ShowCoordinates() {
	const dispatch = useAppDispatch();
	const location = useAppSelector(getMapLocation);

	useMapEvent('mousemove', ({ latlng }) => {
		const newLocation: LatLngLiteral = { lat: latlng.lat, lng: latlng.lng };
		dispatch(mapActions.setLocation(newLocation));
	});

	return (
		<DragControl className={s.block}>
			<span className={s.block__text}>{convertLocation(location.lat, false)}</span>
			<span className={s.block__text}>{convertLocation(location.lng, true)}</span>
		</DragControl>
	);
}

export { ShowCoordinates };
