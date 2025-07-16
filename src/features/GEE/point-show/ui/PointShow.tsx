import { Button } from '@mui/material';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { useGetPointValue } from '../lib';

export const PointShow: React.FC = () => {
	const isLoading = useAppSelector(({ global }) => global.isLoading);
	const { getValue, shouldDisable } = useGetPointValue();

	const changeTileVisibility = async () => {
		await getValue();
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
