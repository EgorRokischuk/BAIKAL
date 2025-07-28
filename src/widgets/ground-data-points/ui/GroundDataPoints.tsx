import dayjs from 'dayjs';
import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import {
	getGroundDataOptions,
	getIsPointsVisible,
	getTileOptionByKey,
	useGetGroundDataPointsQuery,
} from '@/entities/Map';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { convertToDateInput, convertToFullDateTime } from '@/shared/lib/datetimeFormat';
import { convertLocation } from '@/shared/lib/locationConverter';
import MarkIcon from '../assets/Redpoint.png';

const GetIcon = () => {
	return L.icon({
		iconUrl: MarkIcon,
		iconSize: [20, 20],
	});
};

export const GroundDataPoints: React.FC = () => {
	const isPointsVisible = useAppSelector(getIsPointsVisible);
	const type = useAppSelector(getTileOptionByKey('type'));
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
			spiderfyDistanceMultiplier={5}
			zoomToBoundsOnClick
			disableClusteringAtZoom={19}
			maxClusterRadius={95}
			singleMarkerMode={false}
			animated={false}
		>
			{type === 'groundData' &&
				data &&
				data.map((point, idx) => {
					return (
						<Marker key={idx} position={[point.latitude, point.longitude]} icon={GetIcon()}>
							<Popup closeButton={false} key={idx}>
								{`Дата: ${convertToFullDateTime(dayjs(point.date)) ?? ''}`}
								<br />
								{`Широта: ${convertLocation(point.latitude, false)}`}
								<br />
								{`Долгота: ${convertLocation(point.longitude, true)}`}
								<br />
								{`Значение: ${point.value}`}
								<br />
								{`Прибор: ${point.sensor}`}
							</Popup>
						</Marker>
					);
				})}
		</MarkerClusterGroup>
	);
};
