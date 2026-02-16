import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { LatLng, type LatLngLiteral } from 'leaflet';
import type { Dayjs } from 'dayjs';
import type { GeeState, GeeType } from '@/modules/gee/model/types';

const initialState: GeeState = {
  type: 'point',
  dateStart: null,
  dateEnd: null,
  point: [],
  shape: [],
};

const geeSlice = createSlice({
  name: 'gee',
  initialState,
  reducers: {
    setGeeType: (state, action: PayloadAction<GeeType>) => {
      state.type = action.payload;

      if (action.payload === 'point') {
        state.shape = [];
      } else {
        state.point = [];
        state.value = undefined;
      }
    },
    setPoint: (state, action: PayloadAction<LatLngLiteral>) => {
      state.point = [action.payload.lat, action.payload.lng];
    },
    appendShapePoint: (state, action: PayloadAction<LatLngLiteral>) => {
      if (state.shape.length === 4) {
        state.shape = [];
      }

      state.shape.push(new LatLng(action.payload.lat, action.payload.lng));
    },
    clearShape: (state) => {
      state.shape = [];
    },
    clearPoint: (state) => {
      state.point = [];
      state.value = undefined;
    },
    setPointValue: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
    setGeeDate: (
      state,
      action: PayloadAction<{ key: 'dateStart' | 'dateEnd'; value: Dayjs | null }>,
    ) => {
      state[action.payload.key] = action.payload.value;
    },
    resetGee: () => initialState,
  },
});

export const geeReducer = geeSlice.reducer;
export const geeActions = geeSlice.actions;
