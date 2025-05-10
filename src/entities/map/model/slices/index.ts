import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dayjs } from 'dayjs';
import { LatLngLiteral } from 'leaflet';
import { tileOptionsForGroundData } from '../../config/constants';
import { IMapState, ITileOptions } from '../../types';

const initialState: IMapState = {
	zoom: 7,
	location: {
		lat: 53.7,
		lng: 107.7,
	},
	isPointsVisible: false,
	tileLink: '',
	tileOptions: {
		productType: 'Озеро Байкал',
		parameter: 'LST',
		source: 'LANDSAT',
		photoTime: null,
		startDate: null,
		endDate: null,
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
		setPointsVisibillity: (state, action: PayloadAction<boolean>) => {
			state.isPointsVisible = action.payload;
		},
		setTileLink: (state, action: PayloadAction<string>) => {
			state.tileLink = action.payload;
		},
		setMapDate: (
			state,
			action: PayloadAction<{
				key: 'startDate' | 'endDate';
				value: Dayjs | null;
			}>,
		) => {
			state.tileOptions[action.payload.key] = action.payload.value;
		},
		setTileOptions: (
			state,
			action: PayloadAction<{
				key: keyof Omit<ITileOptions, 'startDate' | 'endDate'>;
				value: string;
			}>,
		) => {
			state.tileOptions[action.payload.key] = action.payload.value;

			//if (action.payload.key !== 'photoTime') state.tileOptions.startDate = null;
			if (action.payload.value === 'groundData') {
				if (action.payload.key === 'productType') state.tileOptions = tileOptionsForGroundData;

				state.isPointsVisible = false;
			}
		},
		resetState: () => initialState,
	},
});

export const { reducer: mapReducer, actions: mapActions } = mapSlice;
