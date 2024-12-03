import { Tabs, Tab, Typography } from '@mui/material';
import { disabledTabs } from '../../config/constants';
import { IMapMenu, IMapMenuItem } from '@/entities/map/types';

interface IProps {
	tabIndex: number;
	tabs: IMapMenu;
	setTabIndex: (index: number) => void;
}

const TabMenuHeader = ({ tabIndex, tabs, setTabIndex }: IProps) => {
	return (
		<Tabs
			value={tabIndex}
			onChange={(_, index) => setTabIndex(index)}
			variant={
				tabs.every((tab: IMapMenuItem) => '45678'.includes(tab.title)) ? 'scrollable' : 'fullWidth'
			}
		>
			{tabs.map((tab: IMapMenuItem) => (
				<Tab
					disabled={disabledTabs.includes(tab.title)}
					label={
						<Typography
							variant={!disabledTabs.includes(tab.title) ? 'map_menu' : 'map_menu_disabled'}
						>
							{tab.title}
						</Typography>
					}
					sx={{
						textTransform: 'none',
						padding: '6px 12px',
					}}
				/>
			))}
		</Tabs>
	);
};

export { TabMenuHeader };
