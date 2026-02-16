import type { RootState } from '../index';

export const selectAppState = (state: RootState) => state.app;
export const selectIsLoading = (state: RootState) => state.app.isLoading;
export const selectMessage = (state: RootState) => state.app.message;
export const selectMessageType = (state: RootState) => state.app.messageType;
export const selectCurrentPath = (state: RootState) => state.app.currentPath;
