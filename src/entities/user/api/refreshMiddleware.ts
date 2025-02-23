import { createListenerMiddleware } from '@reduxjs/toolkit';
import { apiAccessTokenExpired } from '@/shared/config/api/apiAccessTokenExpired';

const refreshMiddleware = createListenerMiddleware();

const refreshMiddlewareStartListening = refreshMiddleware.startListening;

refreshMiddlewareStartListening({
	actionCreator: apiAccessTokenExpired,
	effect: async (_, api) => {
		api.dispatch(null); /* refresh */
	},
});

export { refreshMiddleware };
