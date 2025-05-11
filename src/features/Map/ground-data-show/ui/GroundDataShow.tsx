import { Button } from '@mui/material';
import { useMemo } from 'react';
import { getGroundDataOptions, getIsPointsVisible, mapActions } from '@/entities/Map';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';

export const GroundDataShow: React.FC = () => {
	const dispatch = useAppDispatch();

	const isLoading = useAppSelector(({ global }) => global.isLoading);
	const groundDataOptions = useAppSelector(getGroundDataOptions);
	const isPointsVisible = useAppSelector(getIsPointsVisible);

	const disabled = useMemo(
		() =>
			isLoading ||
			!groundDataOptions.startDate ||
			!groundDataOptions.parameter ||
			!groundDataOptions.source,
		[isLoading, groundDataOptions.startDate, groundDataOptions.parameter, groundDataOptions.source],
	);

	const changeTileVisibility = async () => {
		dispatch(mapActions.setPointsVisibillity(!isPointsVisible));
	};

	return (
		<Button disabled={disabled} variant="contained" onClick={changeTileVisibility}>
			{isPointsVisible ? 'Скрыть' : 'Подтвердить'}
		</Button>
	);
};
