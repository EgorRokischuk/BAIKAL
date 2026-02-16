import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getFromStorage } from '@/shared/lib/storage';
import { STORAGE_KEYS } from '@/shared/constants/storageKeys';
import type { UserProfile } from '@/modules/auth/model/types';
import type { AuthState } from './types';

const initialState: AuthState = {
  profile: null,
  accessToken: getFromStorage(STORAGE_KEYS.accessToken) || '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.profile = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.profile = null;
      state.accessToken = '';
    },
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
