import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import type { TileOptions } from '@/modules/map/model/types';

export const selectMap = (state: RootState) => state.map;
export const selectMapZoom = (state: RootState) => state.map.zoom;
export const selectMapLocation = (state: RootState) => state.map.location;
export const selectBaseMapId = (state: RootState) => state.map.baseMapId;
export const selectTileLink = (state: RootState) => state.map.tileLink;
export const selectTileOpacity = (state: RootState) => state.map.tileOpacity;
export const selectLegend = (state: RootState) => state.map.legend;
export const selectIsPointsVisible = (state: RootState) => state.map.isPointsVisible;
export const selectTileOptions = (state: RootState) => state.map.tileOptions;
export const selectCompareState = (state: RootState) => state.map.compare;
export const selectIsCompareEnabled = (state: RootState) => state.map.compare.enabled;
export const selectCompareTileLinks = (state: RootState) => ({
  left: state.map.compare.leftTileLink,
  right: state.map.compare.rightTileLink,
});

export const selectMapDateByKey =
  (key: 'startDate' | 'endDate') => (state: RootState) =>
    state.map.tileOptions[key];

export const selectTileOptionByKey =
  (key: keyof Omit<TileOptions, 'startDate' | 'endDate'>) => (state: RootState) =>
    state.map.tileOptions[key];

export const selectGroundDataOptions = createSelector(
  [
    selectTileOptionByKey('parameter'),
    selectTileOptionByKey('source'),
    selectMapDateByKey('startDate'),
    selectMapDateByKey('endDate'),
  ],
  (parameter, source, startDate, endDate) => ({
    parameter,
    source,
    startDate,
    endDate,
  }),
);
