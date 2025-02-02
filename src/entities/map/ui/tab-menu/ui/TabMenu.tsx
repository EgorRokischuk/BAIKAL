import { useState } from 'react';
import type { IMapMenu } from '@/entities/Map/types';
import { getAvailableTab } from '../lib';
import { MenuBody } from './MenuBody';
import { TabMenuHeader } from './TabMenuHeader';

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
