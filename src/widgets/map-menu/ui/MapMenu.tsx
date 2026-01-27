import { LinearProgress } from '@mui/material';
import { TabMenu } from '@/entities/Map';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { Panel } from '@/shared/ui/Panel';
import { MENU_STRUCTURE } from '../config/constants';
import * as s from './MapMenu.module.scss';
import { MenuActions } from './MenuActions';
import { TileOpacityControl } from './tile-opacity-control/TileOpacityControl';

const MapMenu: React.FC = () => {
	const isLoading = useAppSelector(({ global }) => global.isLoading);

	return (
		<div className={s.menu_container}>
			<Panel header="Данные" width="355px">
				{isLoading && <LinearProgress color="primary" />}
				<Panel.Content>
					<div className={s.menu_content}>
						<TabMenu tabs={MENU_STRUCTURE} />
					</div>
					<TileOpacityControl />
				</Panel.Content>

				<Panel.Actions>
					<MenuActions />
				</Panel.Actions>
			</Panel>
		</div>
	);
};

export { MapMenu };
