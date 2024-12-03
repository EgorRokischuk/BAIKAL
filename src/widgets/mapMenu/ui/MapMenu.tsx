import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Button, Collapse, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import { useState } from 'react';

import * as s from './MapMenu.module.scss';
import { MENU_STRUCTURE } from '../config/constants';
import { TabMenu } from '@/entities/map';

const MapMenu = () => {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<>
			<Collapse in={collapsed}>
				<ArrowForwardIos onClick={() => setCollapsed(false)} />
			</Collapse>

			<Collapse in={!collapsed}>
				<div className={s.container}>
					{/* Menu Header */}
					<div className={s.header}>
						<ArrowBackIos />
						<Typography variant="map_menu_label" align="center">
							Продукты
						</Typography>
						<div />
					</div>

					{/* Menu Content */}
					<TabMenu tabs={MENU_STRUCTURE} />

					{/* Menu Footer (with features) */}
					<div className={s.footer}>
						<Button variant="contained">
							<DownloadIcon />
						</Button>
						<Button variant="contained">Подтвердить</Button>
						<Button>
							<InfoIcon />
						</Button>
					</div>
				</div>
			</Collapse>
		</>
	);
};

export { MapMenu };
