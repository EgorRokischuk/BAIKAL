import { IState } from '@/shared/config/store/State';

export const getPoint = (state: IState) => state.gee.point;
export const getMapDateByKey = (key: 'dateStart' | 'dateEnd') => (state: IState) => state.gee[key];
