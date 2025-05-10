import { IMapMenu, IMapMenuItem } from '../../../../../types';
import { TabPanel } from './TabPanel';

interface IProps {
	tabs: IMapMenu;
	tabIndex: number;
}

const MenuBody: React.FC<IProps> = ({ tabs, tabIndex }) => {
	return (
		<div>
			{tabs.map((tab: IMapMenuItem, index: number) => (
				<TabPanel value={tabIndex} index={index} key={index}>
					<tab.content />
				</TabPanel>
			))}
		</div>
	);
};

export { MenuBody };
