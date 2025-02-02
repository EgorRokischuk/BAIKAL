import { DownloadTile } from '@/features/Map/download-tile';
import { ShowTile } from '@/features/Map/show-tile';
import { TabMenu } from '@/entities/Map';
import { Panel } from '@/shared/ui/Panel';
import { MENU_STRUCTURE } from '../config/constants';

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
