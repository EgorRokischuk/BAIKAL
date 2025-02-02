import { Tabs, Tab, Typography } from '@mui/material';
import { useEffect } from 'react';
import { mapActions } from '@/entities/Map/model/slices';
import { IMapMenu, IMapMenuItem } from '@/entities/Map/types';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { disabledTabs } from '../../../config/constants';

interface IProps {
	tabIndex: number;
	tabs: IMapMenu;
	setTabIndex: (index: number) => void;
}

const TabMenuHeader: React.FC<IProps> = ({ tabIndex, tabs, setTabIndex }) => {
	const dispatch = useAppDispatch();

	const setTileSettings = (pos: number, tile: string) => {
		dispatch(mapActions.setTile({ pos, tile }));
	};

	useEffect(() => {
		setTileSettings(tabs[tabIndex].level, tabs[tabIndex].value || '');
	}, []);

	return (
		<Tabs
			value={tabIndex}
			onChange={(_, index) => setTabIndex(index)}
			variant={
				tabs.every((tab: IMapMenuItem) => '45678'.includes(tab.title)) ? 'scrollable' : 'fullWidth'
			}
		>
			{tabs.map((tab: IMapMenuItem, index: number) => (
				<Tab
					key={index}
					onClick={() => setTileSettings(tab.level, tab.value || '')}
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
