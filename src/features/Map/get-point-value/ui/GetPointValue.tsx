import { useState } from 'react';
import { Popup, useMapEvent } from 'react-leaflet';
import { getMapLocation, getTileLink } from '@/entities/Map';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { convertLocation } from '@/shared/lib/locationConverter';
import { useGetPoint } from '../lib/helpers';

export const GetPointValue: React.FC = () => {
	const tileLink = useAppSelector(getTileLink);
	const tileLocation = useAppSelector(getMapLocation);

	const [location, setLocation] = useState<[number, number] | null>(null);
	const [value, setValue] = useState<string>('');

	const { getPointMutation, isLoading } = useGetPoint();
	useMapEvent('click', async () => {
		if (!tileLink) return;

		setLocation([tileLocation.lat, tileLocation.lng]);

		const response = await getPointMutation([tileLocation.lat, tileLocation.lng]);
		setValue(response.data);
	});

	return (
		<>
			{!isLoading() && !!value && (
				<Popup position={location}>
					{`Широта: ${convertLocation(location[0], false)}`}
					<br />
					{`Долгота: ${convertLocation(location[1], true)}`}
					<br />
					{`Значение: ${value}`}
				</Popup>
			)}
		</>
	);
};
