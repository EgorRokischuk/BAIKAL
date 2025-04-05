import { Button } from '@mui/material';
import {
	getIsTileVisible,
	getTileOptions,
	mapActions,
	useGetTileLinkMutation,
} from '@/entities/Map';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';

const ShowTile: React.FC = () => {
	const dispatch = useAppDispatch();
	const isTileVisibile = useAppSelector(getIsTileVisible);
	const tileOptions = useAppSelector(getTileOptions);
	const [getTileLinkMutation, { isLoading }] = useGetTileLinkMutation();

	const changeTileVisibility = async () => {
		if (isTileVisibile) {
			dispatch(mapActions.setTileLink(''));
			return;
		}

		await getTileLinkMutation(tileOptions);
	};

	return (
		<Button variant="contained" disabled={isLoading} onClick={changeTileVisibility}>
			{isTileVisibile ? 'Скрыть' : 'Подтвердить'}
		</Button>
	);
};

export { ShowTile };
