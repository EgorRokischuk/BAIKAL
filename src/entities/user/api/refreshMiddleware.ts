import { createListenerMiddleware } from '@reduxjs/toolkit';
import { apiAccessTokenExpired } from '@/shared/config/api/apiAccessTokenExpired';
import { authApi } from './authApi';

const refreshMiddleware = createListenerMiddleware();

const refreshMiddlewareStartListening = refreshMiddleware.startListening;

refreshMiddlewareStartListening({
	actionCreator: apiAccessTokenExpired,
	effect: async (_, api) => {
		api.dispatch(authApi.endpoints.refresh.initiate());
	},
});

export { refreshMiddleware };
