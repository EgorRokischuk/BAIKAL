import { MENU_STRUCTURE } from '../config/constants';
import { TabMenu } from '@/entities/Map';
import { ShowTile } from '@/features/Map/show-tile';
import { DownloadTile } from '@/features/Map/download-tile';
import { Panel } from '@/shared/ui/Panel';

const MapMenu: React.FC = () => {
	return (
		<Panel header="Продукты">
			<Panel.Content>
				<TabMenu tabs={MENU_STRUCTURE} />
			</Panel.Content>

			<Panel.Actions>
				<DownloadTile />
				<ShowTile />
			</Panel.Actions>
		</Panel>
	);
};

export { MapMenu };
