import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dayjs } from 'dayjs';
import { LatLng, LatLngLiteral } from 'leaflet';
import { IGEEState } from '../../types';

const initialState: IGEEState = {
	type: 'point',
	dateStart: null,
	point: [],
	shape: [],
};

const geeSlice = createSlice({
	name: 'gee',
	initialState,
	reducers: {
		setGeeType: (state, action: PayloadAction<string>) => {
			state.type = action.payload;

			if (action.payload === 'point') state.shape = [];
			else state.point = [];
		},
		setPoint: (state, action: PayloadAction<LatLngLiteral>) => {
			state.point = [action.payload.lat, action.payload.lng];
		},
		setShapePoint: (state, action: PayloadAction<LatLngLiteral>) => {
			if (state.shape.length === 4) return;

			state.shape.push(new LatLng(action.payload.lat, action.payload.lng));
		},
		clearShape: (state, _action: PayloadAction) => {
			state.shape = [];
		},
		setPointValue: (state, action: PayloadAction<number>) => {
			state.value = action.payload;
		},
		setDate: (
			state,
			action: PayloadAction<{
				key: 'dateStart' | 'dateEnd';
				value: Dayjs | null;
			}>,
		) => {
			state[action.payload.key] = action.payload.value;
		},
		clearPoint: (state, _action: PayloadAction) => {
			state.point = [];
			state.value = undefined;
		},
		resetState: () => initialState,
	},
});

export const { reducer: geeReducer, actions: geeActions } = geeSlice;
