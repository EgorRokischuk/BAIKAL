import { Button } from '@mui/material';
import { getIsTileVisible, mapActions } from '@/entities/Map';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';

const ShowTile: React.FC = () => {
	const dispatch = useAppDispatch();
	const isTileVisibile = useAppSelector(getIsTileVisible);

	const changeTileVisibility = () => {
		dispatch(mapActions.setIsTileVisible(!isTileVisibile));
	};

	return (
		<Button variant="contained" onClick={() => changeTileVisibility()}>
			{isTileVisibile ? 'Скрыть' : 'Подтвердить'}
		</Button>
	);
};

export { ShowTile };
