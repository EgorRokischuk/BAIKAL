import { configureStore } from '@reduxjs/toolkit';
import { mapReducer } from '@/entities/Map';
import { refreshMiddleware } from '@/entities/User';
import { baseApi } from '@/shared/config/api/baseApi';
import { router } from '../../routers';
import { globalReducer } from '../model/globalReducer';

const createReduxStore = () => {
	return configureStore({
		reducer: {
			[baseApi.reducerPath]: baseApi.reducer,
			global: globalReducer,
			map: mapReducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				thunk: {
					extraArgument: {
						navigate: () => router.navigate,
					},
				},
			}).concat(baseApi.middleware, refreshMiddleware.middleware),
	});
};

const _store = createReduxStore();

type RootState = ReturnType<typeof _store.getState>;
type AppDispatch = typeof _store.dispatch;

export { createReduxStore, type RootState, type AppDispatch };
