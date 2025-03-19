import { IState } from '@/shared/config/store/State';

export const getFullProfile = (state: IState) => state.user.fullProfile;
