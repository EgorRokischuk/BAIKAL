import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IGlobalState {
	currentPage: string;
}

const initialState: IGlobalState = {
	currentPage: '/',
};

const globalSlice = createSlice({
	name: 'global',
	initialState,
	reducers: {
		setCurrentPage: (state, action: PayloadAction<string>) => {
			state.currentPage = action.payload;
		},
	},
});

export const { reducer: globalReducer, actions: globalActions } = globalSlice;
export type { IGlobalState };
