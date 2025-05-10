import { getIsPointsVisible, mapActions } from '@/entities/Map';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { Button } from '@/shared/ui/Button';

export const GroundDataShow: React.FC = () => {
	const dispatch = useAppDispatch();
	const isPointsVisible = useAppSelector(getIsPointsVisible);

	const changeTileVisibility = async () => {
		dispatch(mapActions.setPointsVisibillity(!isPointsVisible));
	};

	return (
		<Button variant="contained" onClick={changeTileVisibility}>
			{isPointsVisible ? 'Скрыть' : 'Подтвердить'}
		</Button>
	);
};
