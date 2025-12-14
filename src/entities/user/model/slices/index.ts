import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser, IUserState } from '../../types';

export const initialState: IUserState = {
	fullProfile: null,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setProfile: (state, action: PayloadAction<IUser>) => {
			state.fullProfile = action.payload;
		},
	},
});

export const { reducer: userReducer, actions: userActions } = userSlice;
