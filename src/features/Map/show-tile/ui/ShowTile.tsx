import { Button } from '@mui/material';
import { getTileLink, getTileOptions, mapActions, useGetTileLinkMutation } from '@/entities/Map';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';

const ShowTile: React.FC = () => {
	const dispatch = useAppDispatch();
	const tileLink = useAppSelector(getTileLink);
	const tileOptions = useAppSelector(getTileOptions);
	const [getTileLinkMutation, { isLoading }] = useGetTileLinkMutation();

	const changeTileVisibility = async () => {
		if (tileLink) {
			dispatch(mapActions.setTileLink(''));
			return;
		}

		await getTileLinkMutation(tileOptions);
	};

	return (
		<Button variant="contained" disabled={isLoading} onClick={changeTileVisibility}>
			{tileLink ? 'Скрыть' : 'Подтвердить'}
		</Button>
	);
};

export { ShowTile };
