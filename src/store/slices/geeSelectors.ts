import type { RootState } from '../index';

export const selectGee = (state: RootState) => state.gee;
export const selectGeeType = (state: RootState) => state.gee.type;
export const selectGeePoint = (state: RootState) => state.gee.point;
export const selectGeeValue = (state: RootState) => state.gee.value;
export const selectGeeDateByKey =
  (key: 'dateStart' | 'dateEnd') => (state: RootState) =>
    state.gee[key];
