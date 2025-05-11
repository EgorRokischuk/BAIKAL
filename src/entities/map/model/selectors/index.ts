import { createSelector } from '@reduxjs/toolkit';
import { IState } from '@/shared/config/store/State';
import { ITileOptions } from '../../types';

export const getMapZoom = (state: IState) => state.map.zoom;
export const getMapLocation = (state: IState) => state.map.location;
export const getIsPointsVisible = (state: IState) => state.map.isPointsVisible;
export const getTileLink = (state: IState) => state.map.tileLink;
export const getMapDateByKey = (key: 'startDate' | 'endDate') => (state: IState) =>
	state.map.tileOptions[key];
export const getTileOptions = (state: IState) => state.map.tileOptions;
export const getTileOptionByKey =
	(key: keyof Omit<ITileOptions, 'startDate' | 'endDate'>) => (state: IState) =>
		state.map.tileOptions[key];
export const getGroundDataOptions = createSelector(
	[
		getTileOptionByKey('parameter'),
		getTileOptionByKey('source'),
		getMapDateByKey('startDate'),
		getMapDateByKey('endDate'),
	],
	(parameter, source, startDate, endDate) => ({
		parameter,
		source,
		startDate,
		endDate,
	}),
);
