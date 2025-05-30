import { LinearProgress } from '@mui/material';
import { TabMenu } from '@/entities/Map';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { Panel } from '@/shared/ui/Panel';
import { MENU_STRUCTURE } from '../config/constants';
import { MenuActions } from './MenuActions';

const MapMenu: React.FC = () => {
	const isLoading = useAppSelector(({ global }) => global.isLoading);

	return (
		<Panel header="Продукты" width="355px">
			{isLoading && <LinearProgress color="primary" />}
			<Panel.Content>
				<TabMenu tabs={MENU_STRUCTURE} />
			</Panel.Content>

			<Panel.Actions>
				<MenuActions />
			</Panel.Actions>
		</Panel>
	);
};

export { MapMenu };
