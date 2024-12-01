import { IGlobalState } from '@/app/providers/store/model/globalReducer';
import { IMapState } from '@/entities/map';

export interface IState {
	global: IGlobalState;
	map: IMapState;
}
