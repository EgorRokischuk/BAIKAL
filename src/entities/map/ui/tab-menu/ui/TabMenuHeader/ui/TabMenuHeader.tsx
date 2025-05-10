import { Tabs, Tab, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { mapActions } from '../../../../../model/slices';
import { IMapMenu, IMapMenuItem, ITileOptions } from '../../../../../types';
import { disabledTabs } from '../../../config/constants';

interface IProps {
	tabIndex: number;
	tabs: IMapMenu;
	setTabIndex: (index: number) => void;
}

const TabMenuHeader: React.FC<IProps> = ({ tabIndex, tabs, setTabIndex }) => {
	const dispatch = useAppDispatch();

	const setTileSettings = (
		key: keyof Omit<ITileOptions, 'startDate' | 'endDate'>,
		value: string,
	) => {
		dispatch(mapActions.setTileOptions({ key, value }));
	};

	useEffect(() => {
		setTileSettings(tabs[tabIndex].key, tabs[tabIndex].value);
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
					onClick={() => setTileSettings(tab.key, tab.value || '')}
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
