import { getIsTileVisible, mapActions } from '@/entities/map';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { Button } from '@mui/material';

const ShowTile = () => {
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
