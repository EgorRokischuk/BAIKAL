import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import {
	getGroundDataOptions,
	getIsPointsVisible,
	useGetGroundDataPointsQuery,
} from '@/entities/Map';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { convertToDateInput } from '@/shared/lib/datetimeFormat';
import { convertLocation } from '@/shared/lib/locationConverter';
import MarkIcon from './Redpoint.png';

const GetIcon = () => {
	return L.icon({
		iconUrl: MarkIcon,
		iconSize: [20, 20],
	});
};

export const GroundDataPoints: React.FC = () => {
	const isPointsVisible = useAppSelector(getIsPointsVisible);
	const groundDataParams = useAppSelector(getGroundDataOptions);

	const { data, isFetching } = useGetGroundDataPointsQuery(
		{
			...groundDataParams,
			startDate: convertToDateInput(groundDataParams.startDate),
			endDate: convertToDateInput(groundDataParams.endDate),
		},
		{ skip: !isPointsVisible },
	);

	if (isFetching || !isPointsVisible) return <></>;

	return (
		<MarkerClusterGroup
			spiderfyDistanceMultiplier={3}
			zoomToBoundsOnClick
			disableClusteringAtZoom={20}
			maxClusterRadius={95}
			singleMarkerMode={false}
			animated={false}
		>
			{data &&
				data.map((point, idx) => {
					return (
						<Marker key={idx} position={point.coordinates} icon={GetIcon()}>
							<Popup closeButton={false} key={idx}>
								{`Широта: ${convertLocation(point.coordinates[0], false)}`}
								<br />
								{`Долгота: ${convertLocation(point.coordinates[1], true)}`}
								<br />
								{`Значение: ${point.value}${point.unit}`}
								<br />
								{`Прибор: ${point.sensor}`}
							</Popup>
						</Marker>
					);
				})}
		</MarkerClusterGroup>
	);
};
