import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { LatLngLiteral } from 'leaflet';
import { IMapState, ITileOptions } from '../../types';

const initialState: IMapState = {
	zoom: 7,
	location: {
		lat: 53.7,
		lng: 107.7,
	},
	date: '',
	isTileVisible: false,
	tileLink: '',
	tileOptions: {
		type: 'Озеро Байкал',
		parameter: 'LST',
		device: 'LANDSAT',
	},
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
		setTileLink: (state, action: PayloadAction<string>) => {
			state.tileLink = action.payload;
			state.isTileVisible = true;
		},
		setTileOptions: (state, action: PayloadAction<{ key: keyof ITileOptions; value: string }>) => {
			state.tileOptions[action.payload.key] = action.payload.value;
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
