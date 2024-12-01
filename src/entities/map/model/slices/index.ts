import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMapState } from '../../types';
import { LatLngLiteral } from 'leaflet';

const initialState: IMapState = {
	zoom: 7,
	location: {
		lat: 53.7,
		lng: 107.7,
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
		resetState: () => initialState,
	},
});

export const { reducer: mapReducer, actions: mapActions } = mapSlice;
