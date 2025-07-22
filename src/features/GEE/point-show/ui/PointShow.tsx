import { Button } from '@mui/material';
import { getGeeType } from '@/entities/GEE';
import { IGetGEEPolygonResponse } from '@/entities/GEE';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { useGetPointValue } from '../lib';

export const PointShow: React.FC = () => {
	const geeType = useAppSelector(getGeeType);
	const isLoading = useAppSelector(({ global }) => global.isLoading);
	const { getValue, shouldDisable } = useGetPointValue();

	const changeTileVisibility = async () => {
		const response = await getValue();

		if (geeType === 'polygon') window.open((response.data as IGetGEEPolygonResponse).url, '_blank');
	};

	return (
		<Button
			variant="contained"
			disabled={isLoading || shouldDisable()}
			onClick={changeTileVisibility}
		>
			{'Подтвердить'}
		</Button>
	);
};
