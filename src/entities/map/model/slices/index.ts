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
		type: '',
		productType: 'baikalRiver',
		parameter: 'temperature',
		source: 'viirs',
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
			state.tileLink = '';
			state.tileOptions[action.payload.key] = action.payload.value;

			if (state.tileOptions.productType === 'groundData')
				state.tileOptions = {
					...tileOptionsForGroundData,
					startDate: state.tileOptions.startDate,
					endDate: state.tileOptions.endDate,
				};
		},
		setTileOptions: (
			state,
			action: PayloadAction<{
				key: keyof Omit<ITileOptions, 'startDate' | 'endDate'>;
				value: string;
			}>,
		) => {
			state.tileLink = '';
			state.tileOptions[action.payload.key] = action.payload.value;

			if (state.tileOptions.productType === 'groundData') {
				switch (action.payload.key) {
					case 'productType':
						state.tileOptions = { ...tileOptionsForGroundData };
						break;
					case 'parameter':
						state.tileOptions.source = '';
						break;
				}

				state.isPointsVisible = false;
			} else {
				if (action.payload.value === 'landsat') state.tileOptions.type = 'landsat';
				if (['viirs', 'terra', 'aqua'].includes(action.payload.value)) state.tileOptions.type = '';
				state.tileOptions.startDate = null;
			}
		},
		resetState: () => initialState,
	},
});

export const { reducer: mapReducer, actions: mapActions } = mapSlice;
