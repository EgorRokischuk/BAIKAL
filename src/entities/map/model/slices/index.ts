import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { LatLngLiteral } from 'leaflet';
import { IMapState } from '../../types';

const initialState: IMapState = {
	zoom: 7,
	location: {
		lat: 53.7,
		lng: 107.7,
	},
	isTileVisible: false,
	date: '',
	tile: ['temperature', 'landsat', 'Landsat_8'],
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
		setDate: (state, action: PayloadAction<string>) => {
			const formattedDate = dayjs(action.payload).format('DD_MM_YY');
			state.date = formattedDate;
		},
		setIsTileVisible: (state, action: PayloadAction<boolean>) => {
			state.isTileVisible = action.payload;
		},
		setTile: (state, action: PayloadAction<{ pos: number; tile: string }>) => {
			state.isTileVisible = false;

			if (action.payload.pos === -1) {
				state.tile = [];
				return;
			}

			state.tile.splice(action.payload.pos, state.tile.length - action.payload.pos);
			state.tile[action.payload.pos] = action.payload.tile;
		},
		resetState: () => initialState,
	},
});

export const { reducer: mapReducer, actions: mapActions } = mapSlice;
