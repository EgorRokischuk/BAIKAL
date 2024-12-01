import { IState } from '@/shared/config/store/State';

export const getMapZoom = (state: IState) => state.map.zoom;
export const getMapLocation = (state: IState) => state.map.location;
