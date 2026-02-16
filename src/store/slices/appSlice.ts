import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppState } from './types';

const initialState: AppState = {
  isLoading: false,
  message: '',
  messageType: 'info',
  currentPath: '/',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCurrentPath: (state, action: PayloadAction<string>) => {
      state.currentPath = action.payload;
    },
    showInfo: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
      state.messageType = 'info';
    },
    showSuccess: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
      state.messageType = 'success';
    },
    showWarning: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
      state.messageType = 'warning';
    },
    showError: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
      state.messageType = 'error';
    },
    clearMessage: (state) => {
      state.message = '';
    },
  },
});

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;
