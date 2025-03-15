/* eslint-disable @conarti/feature-sliced/layers-slices */
import { IGlobalState } from '@/app/providers/store/model/globalReducer';
import { IMapState } from '@/entities/Map';
import { IUserState } from '@/entities/User';

export interface IState {
	global: IGlobalState;
	map: IMapState;
	user: IUserState;
}
