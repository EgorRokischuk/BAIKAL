import { IMapMenu, IMapMenuItem } from '@/entities/Map/types';
import { disabledTabs } from '../config/constants';

export const getAvailableTab = (tabs: IMapMenu) => {
	return tabs.findIndex((tab: IMapMenuItem) => !disabledTabs.includes(tab.title));
};
