import { LinearProgress } from '@mui/material';
import { DownloadTile } from '@/features/Map/download-tile';
import { ShowTile } from '@/features/Map/show-tile';
import { TabMenu } from '@/entities/Map';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { Panel } from '@/shared/ui/Panel';
import { MENU_STRUCTURE } from '../config/constants';

const MapMenu: React.FC = () => {
	const isLoading = useAppSelector(({ global }) => global.isLoading);

	return (
		<Panel header="Продукты">
			{isLoading && <LinearProgress color="primary" />}
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
