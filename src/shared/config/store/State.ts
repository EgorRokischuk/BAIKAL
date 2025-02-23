/* eslint-disable @conarti/feature-sliced/layers-slices */
import { IGlobalState } from '@/app/providers/store/model/globalReducer';
import { IMapState } from '@/entities/Map';

export interface IState {
	global: IGlobalState;
	map: IMapState;
}
