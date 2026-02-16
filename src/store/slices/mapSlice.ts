import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Dayjs } from 'dayjs';
import type { LatLngLiteral } from 'leaflet';
import type { BaseMapId, MapState, TileOptions } from '@/modules/map/model/types';

const groundDefaults: TileOptions = {
  type: 'groundData',
  productType: 'groundData',
  parameter: '',
  source: '',
  photoTime: null,
  startDate: null,
  endDate: null,
};

const initialState: MapState = {
  zoom: 7,
  location: {
    lat: 53.7,
    lng: 107.7,
  },
  baseMapId: 'osm',
  isPointsVisible: false,
  tileLink: '',
  tileOpacity: 1,
  legend: {
    min: null,
    max: null,
    visible: false,
  },
  tileOptions: {
    type: 'monthlyAvg',
    productType: 'baikalRiver',
    parameter: 'temperature',
    source: 'viirs',
    photoTime: 'daily',
    startDate: null,
    endDate: null,
  },
  compare: {
    enabled: false,
    leftDate: null,
    rightDate: null,
    leftTileLink: '',
    rightTileLink: '',
  },
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setLocation: (state, action: PayloadAction<LatLngLiteral>) => {
      state.location = action.payload;
    },
    setBaseMap: (state, action: PayloadAction<BaseMapId>) => {
      state.baseMapId = action.payload;
    },
    setPointsVisibility: (state, action: PayloadAction<boolean>) => {
      state.isPointsVisible = action.payload;
    },
    setTileLink: (state, action: PayloadAction<string>) => {
      state.tileLink = action.payload;
    },
    setTileOpacity: (state, action: PayloadAction<number>) => {
      const next = Number.isFinite(action.payload) ? action.payload : state.tileOpacity;
      state.tileOpacity = Math.min(1, Math.max(0, next));
    },
    setLegend: (state, action: PayloadAction<{ min: number; max: number }>) => {
      state.legend.min = action.payload.min;
      state.legend.max = action.payload.max;
      state.legend.visible = true;
    },
    hideLegend: (state) => {
      state.legend.visible = false;
      state.legend.min = null;
      state.legend.max = null;
    },
    setMapDate: (
      state,
      action: PayloadAction<{ key: 'startDate' | 'endDate'; value: Dayjs | null }>,
    ) => {
      state.tileLink = '';
      state.legend.visible = false;
      state.compare.enabled = false;
      state.compare.leftTileLink = '';
      state.compare.rightTileLink = '';
      state.tileOptions[action.payload.key] = action.payload.value;

      if (state.tileOptions.productType === 'groundData') {
        state.isPointsVisible = false;
        state.tileOptions = {
          ...groundDefaults,
          startDate: state.tileOptions.startDate,
          endDate: state.tileOptions.endDate,
        };
      }
    },
    setTileOption: (
      state,
      action: PayloadAction<{
        key: keyof Omit<TileOptions, 'startDate' | 'endDate'>;
        value: string | null;
      }>,
    ) => {
      state.tileLink = '';
      state.legend.visible = false;
      state.isPointsVisible = false;
      state.compare.enabled = false;
      state.compare.leftTileLink = '';
      state.compare.rightTileLink = '';

      (state.tileOptions[action.payload.key] as string | null) = action.payload.value;

      if (state.tileOptions.productType === 'groundData') {
        if (action.payload.key === 'productType') {
          state.tileOptions = { ...groundDefaults };
        }

        if (action.payload.key === 'parameter') {
          state.tileOptions.source = '';
        }
      } else {
        if (action.payload.value === 'landsat') {
          state.tileOptions.type = 'landsat';
          state.tileOptions.photoTime = null;
        }

        if (
          ['viirs', 'terra', 'aqua', 'sentinel'].includes(action.payload.value ?? '') &&
          state.tileOptions.parameter !== 'chlorophyll'
        ) {
          state.tileOptions.type = 'monthlyAvg';
          if (!state.tileOptions.photoTime) {
            state.tileOptions.photoTime = 'daily';
          }
        }

        if (action.payload.key === 'parameter' && action.payload.value === 'chlorophyll') {
          state.tileOptions = {
            ...state.tileOptions,
            source: 'sentinel',
            type: 'chlorophyll',
          };
        }

        if (
          action.payload.key === 'parameter' &&
          action.payload.value !== 'chlorophyll' &&
          state.tileOptions.type === 'chlorophyll'
        ) {
          state.tileOptions.type = 'monthlyAvg';
          state.tileOptions.source = 'viirs';
          state.tileOptions.photoTime = 'daily';
        }

        state.tileOptions.startDate = null;
        state.tileOptions.endDate = null;
      }
    },
    setCompareEnabled: (state, action: PayloadAction<boolean>) => {
      state.compare.enabled = action.payload;
      if (!action.payload) {
        state.compare.leftTileLink = '';
        state.compare.rightTileLink = '';
      } else {
        state.tileLink = '';
        state.legend.visible = false;
      }
    },
    setCompareDate: (
      state,
      action: PayloadAction<{ side: 'left' | 'right'; value: Dayjs | null }>,
    ) => {
      if (action.payload.side === 'left') {
        state.compare.leftDate = action.payload.value;
      } else {
        state.compare.rightDate = action.payload.value;
      }
      state.compare.leftTileLink = '';
      state.compare.rightTileLink = '';
    },
    setCompareTileLinks: (
      state,
      action: PayloadAction<{ leftTileLink: string; rightTileLink: string }>,
    ) => {
      state.compare.leftTileLink = action.payload.leftTileLink;
      state.compare.rightTileLink = action.payload.rightTileLink;
    },
    resetMapState: () => initialState,
  },
});

export const mapReducer = mapSlice.reducer;
export const mapActions = mapSlice.actions;
