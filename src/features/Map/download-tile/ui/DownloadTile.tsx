import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { getIsTileVisible, getTile, getTileDate } from '@/entities/map';
import { Link } from 'react-router-dom';

import * as s from './DownloadTile.module.scss';

const DownloadTile = () => {
	const isTileVisible = useAppSelector(getIsTileVisible);
	const date = useAppSelector(getTileDate);
	const tile = useAppSelector(getTile);

	return (
		<Link
			className={s.link}
			to={`${process.env.TILE_API_URL}/${tile.join('/')}_${date}/${tile[tile.length - 1]}_${date}.tif`}
			download
		>
			<Button variant="contained" disabled={!isTileVisible}>
				<DownloadIcon />
			</Button>
		</Link>
	);
};

export { DownloadTile };
