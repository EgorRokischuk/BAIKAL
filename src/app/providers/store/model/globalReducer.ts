import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IGlobalState {
	isLoading: boolean;
	currentPage: string;
	accessToken: string;
}

const initialState: IGlobalState = {
	isLoading: false,
	currentPage: '/',
	accessToken: '',
};

const globalSlice = createSlice({
	name: 'global',
	initialState,
	reducers: {
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
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
