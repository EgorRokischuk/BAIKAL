import { Polygon } from 'react-leaflet';
import { getGeeState } from '@/entities/GEE/model/selectors';
import { useAppSelector } from '@/shared/hooks/useAppSelector';

export const GeeShape: React.FC = () => {
	const options = useAppSelector(getGeeState);

	return (
		<>
			<Polygon pathOptions={{ color: 'blue' }} positions={options.shape} />
		</>
	);
};
