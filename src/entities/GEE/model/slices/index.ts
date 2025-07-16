import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dayjs } from 'dayjs';
import { LatLngLiteral } from 'leaflet';
import { IGEEState } from '../../types';

const initialState: IGEEState = {
	type: 'point',
	dateStart: null,
	point: [],
};

const geeSlice = createSlice({
	name: 'gee',
	initialState,
	reducers: {
		setGeeType: (state, action: PayloadAction<string>) => {
			state.type = action.payload;
		},
		setPoint: (state, action: PayloadAction<LatLngLiteral>) => {
			state.point = [action.payload.lat, action.payload.lng];
		},
		setMapDate: (
			state,
			action: PayloadAction<{
				key: 'dateStart' | 'dateEnd';
				value: Dayjs | null;
			}>,
		) => {
			state[action.payload.key] = action.payload.value;
		},
		resetState: () => initialState,
	},
});

export const { reducer: geeReducer, actions: geeActions } = geeSlice;
