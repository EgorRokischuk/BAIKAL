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

	legend: {
		min: null,
		max: null,
		visible: false,
	},

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

		setLegend: (
			state,
			action: PayloadAction<{ min: number; max: number }>,
		) => {
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
			action: PayloadAction<{
				key: 'startDate' | 'endDate';
				value: Dayjs | null;
			}>,
		) => {
			state.tileLink = '';
			state.legend.visible = false;

			state.tileOptions[action.payload.key] = action.payload.value;

			if (state.tileOptions.productType === 'groundData') {
				state.isPointsVisible = false;
				state.tileOptions = {
					...tileOptionsForGroundData,
					startDate: state.tileOptions.startDate,
					endDate: state.tileOptions.endDate,
				};
			}
		},

		setTileOptions: (
			state,
			action: PayloadAction<{
				key: keyof Omit<ITileOptions, 'startDate' | 'endDate'>;
				value: string;
			}>,
		) => {
                                    state.tileLink = '';
                        state.legend.visible = false;
                        state.isPointsVisible = false;

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
                        } else {
                                if (action.payload.value === 'landsat') state.tileOptions.type = 'landsat';
                                if (
                                        ['viirs', 'terra', 'aqua', 'sentinel'].includes(action.payload.value) &&
                                        state.tileOptions.parameter !== 'chlorophyll'
                                )
                                        state.tileOptions.type = '';
                                if (
                                        action.payload.key === 'parameter' &&
                                        action.payload.value === 'chlorophyll'
                                )
                                        state.tileOptions = {
                                                ...state.tileOptions,
                                                source: 'sentinel',
                                                type: 'chlorophyll',
                                        };
                                if (
                                        action.payload.key === 'parameter' &&
                                        action.payload.value !== 'chlorophyll' &&
                                        state.tileOptions.type === 'chlorophyll'
                                )
                                        state.tileOptions.type = '';
                                state.tileOptions.startDate = null;
                        }
                },

		resetState: () => initialState,
	},
});

export const { reducer: mapReducer, actions: mapActions } = mapSlice;
