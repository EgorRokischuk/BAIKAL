import { IState } from '@/shared/config/store/State';

export const getGeeState = (state: IState) => state.gee;
export const getPoint = (state: IState) => state.gee.point;
export const getPointValue = (state: IState) => state.gee.value;
export const getGeeType = (state: IState) => state.gee.type;
export const getGeeDateByKey = (key: 'dateStart' | 'dateEnd') => (state: IState) => state.gee[key];
