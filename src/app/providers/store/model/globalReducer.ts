import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IGlobalState {
	currentPage: string;
	accessToken: string;
}

const initialState: IGlobalState = {
	currentPage: '/',
	accessToken: '',
};

const globalSlice = createSlice({
	name: 'global',
	initialState,
	reducers: {
		setCurrentPage: (state, action: PayloadAction<string>) => {
			state.currentPage = action.payload;
		},
		setAccessToken: (state, action: PayloadAction<string>) => {
			state.accessToken = action.payload;
		},
	},
});

export const { reducer: globalReducer, actions: globalActions } = globalSlice;
export type { IGlobalState };
