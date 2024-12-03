import { disabledTabs } from '../config/constants';
import { IMapMenu } from '@/entities/map/types';

export const getAvailableTab = (tabs: IMapMenu) => {
	return tabs.findIndex((tab: any) => !disabledTabs.includes(tab.title));
};
