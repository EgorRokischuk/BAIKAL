import { createListenerMiddleware } from '@reduxjs/toolkit';
import { apiTokenExpired } from '@/api/tokenExpired';
import { authApi } from '@/modules/auth/authApi';

export const tokenRefreshMiddleware = createListenerMiddleware();

tokenRefreshMiddleware.startListening({
  actionCreator: apiTokenExpired,
  effect: async (_, api) => {
    api.dispatch(authApi.endpoints.refresh.initiate());
  },
});
