import { IMapMenu, IMapMenuItem } from '@/entities/map/types';
import { TabPanel } from './TabPanel';

interface IProps {
	tabs: IMapMenu;
	tabIndex: number;
}

const MenuBody = ({ tabs, tabIndex }: IProps) => {
	return (
		<div>
			{tabs.map((tab: IMapMenuItem, index: number) => (
				<TabPanel value={tabIndex} index={index} key={index}>
					{tab.content}
				</TabPanel>
			))}
		</div>
	);
};

export { MenuBody };
