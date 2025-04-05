import { IState } from '@/shared/config/store/State';

export const getMapZoom = (state: IState) => state.map.zoom;
export const getMapLocation = (state: IState) => state.map.location;
export const getIsTileVisible = (state: IState) => state.map.isTileVisible;
export const getTileDate = (state: IState) => state.map.date;
export const getTileLink = (state: IState) => state.map.tileLink;
export const getTileOptions = (state: IState) => state.map.tileOptions;
export const getTile = (state: IState) => state.map.tile;
