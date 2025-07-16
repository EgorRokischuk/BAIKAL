import { useMapEvent } from 'react-leaflet';
import { geeActions, getGeeType } from '@/entities/GEE';
import { getMapLocation, getTileOptionByKey } from '@/entities/Map';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';

export const PointLocationSet: React.FC = () => {
	const dispatch = useAppDispatch();
	const tileLocation = useAppSelector(getMapLocation);
	const geeType = useAppSelector(getGeeType);
	const isLoading = useAppSelector(({ global }) => global.isLoading);
	const menuType = useAppSelector(getTileOptionByKey('productType'));

	useMapEvent('click', async () => {
		if (menuType !== 'gee' || isLoading || geeType !== 'point') return;

		dispatch(geeActions.setPoint(tileLocation));
	});

	return <></>;
};
