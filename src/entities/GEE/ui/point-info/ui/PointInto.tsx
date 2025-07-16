import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { getGeeState } from '@/entities/GEE/model/selectors';
import { geeActions } from '@/entities/GEE/model/slices';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { convertLocation } from '@/shared/lib/locationConverter';
import MarkIcon from '../assets/Redpoint.png';

const GetIcon = () => {
	return L.icon({
		iconUrl: MarkIcon,
		iconSize: [10, 10],
	});
};

export const PointInfo: React.FC = () => {
	const dispatch = useAppDispatch();
	const options = useAppSelector(getGeeState);

	if (options.point.length !== 2) return null;

	return (
		<>
			<Marker position={{ lat: options.point[0], lng: options.point[1] }} icon={GetIcon()} />
			{options.value && (
				<Popup
					position={{ lat: options.point[0], lng: options.point[1] }}
					eventHandlers={{ remove: () => dispatch(geeActions.clearPoint()) }}
				>
					{`Широта: ${convertLocation(options.point[0], false)}`}
					<br />
					{`Долгота: ${convertLocation(options.point[1], true)}`}
					<br />
					{`Значение: ${options.value}`}
				</Popup>
			)}
		</>
	);
};
