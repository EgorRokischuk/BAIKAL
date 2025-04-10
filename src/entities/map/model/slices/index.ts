import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dayjs } from 'dayjs';
import { LatLngLiteral } from 'leaflet';
import { IMapState, ITileOptions } from '../../types';

const initialState: IMapState = {
	zoom: 7,
	location: {
		lat: 53.7,
		lng: 107.7,
	},
	isTileVisible: false,
	tileLink: '',
	tileOptions: {
		type: 'Озеро Байкал',
		parameter: 'LST',
		device: 'LANDSAT',
		photoTime: null,
		date: null,
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
		setIsTileVisible: (state, action: PayloadAction<boolean>) => {
			state.isTileVisible = action.payload;
		},
		setTileLink: (state, action: PayloadAction<string>) => {
			state.tileLink = action.payload;
			state.isTileVisible = !!action.payload;
		},
		setTileOptions: (
			state,
			action: PayloadAction<{ key: keyof Omit<ITileOptions, 'date'>; value: string }>,
		) => {
			state.tileOptions[action.payload.key] = action.payload.value;

			if (action.payload.key !== 'photoTime') state.tileOptions.date = null;
		},
		setTileDate: (state, action: PayloadAction<Dayjs | null>) => {
			state.tileOptions.date = action.payload;
		},
		resetState: () => initialState,
	},
});

export const { reducer: mapReducer, actions: mapActions } = mapSlice;
