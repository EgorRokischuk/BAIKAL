import { IState } from '@/shared/config/store/State';
import { ITileOptions } from '../../types';

export const getMapZoom = (state: IState) => state.map.zoom;
export const getMapLocation = (state: IState) => state.map.location;
export const getIsTileVisible = (state: IState) => state.map.isTileVisible;
export const getTileLink = (state: IState) => state.map.tileLink;
export const getTileOptions = (state: IState) => state.map.tileOptions;
export const getTileOptionByKey = (key: keyof ITileOptions) => (state: IState) =>
	state.map.tileOptions[key];
