import { useMap, useMapEvent } from 'react-leaflet';
import { Button } from '@mui/material';

import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { mapActions } from '@/entities/Map';
import { DragControl } from '@/shared/ui';

import * as s from './ChangeZoom.module.scss';
import { btnStyle } from '../config/sxStyles';

function ChangeZoom() {
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
					+
				</Button>
			</div>

			<div className={s.block__btn}>
				<Button sx={btnStyle} onClick={() => handleClick('out')}>
					-
				</Button>
			</div>
		</DragControl>
	);
}

export { ChangeZoom };
