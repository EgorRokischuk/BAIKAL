import { Slider, Typography } from '@mui/material';
import { getTileLink, getTileOpacity, mapActions } from '@/entities/Map';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import * as s from './TileOpacityControl.module.scss';

const SLIDER_STEP = 5;

export const TileOpacityControl: React.FC = () => {
	const dispatch = useAppDispatch();
	const tileLink = useAppSelector(getTileLink);
	const tileOpacity = useAppSelector(getTileOpacity);

	if (!tileLink) return null;

	const opacityPercent = Math.round((tileOpacity * 100) / SLIDER_STEP) * SLIDER_STEP;

	const handleOpacityChange = (_: Event, value: number | number[]) => {
		const nextValue = Array.isArray(value) ? value[0] : value;
		dispatch(mapActions.setTileOpacity(nextValue / 100));
	};

	return (
		<div className={s.opacity_control}>
			<Typography className={s.opacity_control__label} variant="caption">
				{`Прозрачность слоя: ${opacityPercent}%`}
			</Typography>
			<Slider
				size="small"
				min={0}
				max={100}
				step={SLIDER_STEP}
				value={opacityPercent}
				onChange={handleOpacityChange}
			/>
		</div>
	);
};
