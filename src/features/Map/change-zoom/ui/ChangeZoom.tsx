import { useMap, useMapEvent } from 'react-leaflet';
import { Button } from '@mui/material';

import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { mapActions } from '@/entities/Map';
import { DragControl } from '@/shared/ui/DragControl';

import * as s from './ChangeZoom.module.scss';
import { btnStyle } from '../config/sxStyles';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const ChangeZoom: React.FC = () => {
	const map = useMap();
	const dispatch = useAppDispatch();

	useMapEvent('zoomend', () => dispatch(mapActions.setZoom(map.getZoom())));

	const handleClick = (type: string) => {
		const newZoom = type === 'in' ? map.getZoom() + 1 : map.getZoom() - 1;

		map.setZoom(newZoom);
		dispatch(mapActions.setZoom(newZoom));
	};

	return (
		<DragControl className={s.block}>
			<div className={s.block__btn}>
				<Button sx={btnStyle} onClick={() => handleClick('in')}>
					<AddIcon />
				</Button>
			</div>

			<div className={s.block__btn}>
				<Button sx={btnStyle} onClick={() => handleClick('out')}>
					<RemoveIcon />
				</Button>
			</div>
		</DragControl>
	);
};

export { ChangeZoom };
