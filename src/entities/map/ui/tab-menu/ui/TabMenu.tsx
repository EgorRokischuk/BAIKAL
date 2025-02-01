import { useState } from 'react';
import { getAvailableTab } from '../lib';
import { TabMenuHeader } from './TabMenuHeader';
import { MenuBody } from './MenuBody';
import type { IMapMenu } from '@/entities/Map/types';

interface IProps {
	tabs: IMapMenu;
}

const TabMenu: React.FC<IProps> = ({ tabs }) => {
	const [tabIndex, setTabIndex] = useState<number>(getAvailableTab(tabs));

	const changeTabIndex = (newTabIndex: number) => {
		setTabIndex(newTabIndex);
	};

	return (
		<div>
			<TabMenuHeader tabIndex={tabIndex} tabs={tabs} setTabIndex={changeTabIndex} />
			<MenuBody tabs={tabs} tabIndex={tabIndex} />
		</div>
	);
};

export { TabMenu };
