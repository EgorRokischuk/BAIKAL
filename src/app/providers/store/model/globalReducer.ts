import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IGlobalState {
	isLoading: boolean;
	currentPage: string;
	accessToken: string;

	message: string;
	messageType: 'success' | 'warning' | 'error' | 'info';
}

const initialState: IGlobalState = {
	isLoading: false,
	currentPage: '/',
	accessToken: '',

	message: '',
	messageType: 'info',
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
		setMessage: (state, action: PayloadAction<string>) => {
			state.message = action.payload;
			state.messageType = 'info';
		},
		setSuccessMessage: (state, action: PayloadAction<string>) => {
			state.message = action.payload;
			state.messageType = 'success';
		},
		setWarningMessage: (state, action: PayloadAction<string>) => {
			state.message = action.payload;
			state.messageType = 'warning';
		},
		setErrorMessage: (state, action: PayloadAction<string>) => {
			state.message = action.payload;
			state.messageType = 'error';
		},
	},
});

export const { reducer: globalReducer, actions: globalActions } = globalSlice;
export type { IGlobalState };
