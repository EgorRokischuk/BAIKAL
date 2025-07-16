import { configureStore } from '@reduxjs/toolkit';
import { geeReducer } from '@/entities/GEE';
import { mapReducer } from '@/entities/Map';
import { refreshMiddleware, userReducer } from '@/entities/User';
import { baseApi } from '@/shared/config/api/baseApi';
import { router } from '../../routers';
import { globalReducer } from '../model/globalReducer';

const createReduxStore = () => {
	return configureStore({
		reducer: {
			[baseApi.reducerPath]: baseApi.reducer,
			global: globalReducer,
			user: userReducer,
			map: mapReducer,
			gee: geeReducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				thunk: {
					extraArgument: {
						navigate: (to: string) => router.navigate(to),
					},
				},
				serializableCheck: false,
			}).concat(baseApi.middleware, refreshMiddleware.middleware),
	});
};

const _store = createReduxStore();

type RootState = ReturnType<typeof _store.getState>;
type AppDispatch = typeof _store.dispatch;

export { createReduxStore, type RootState, type AppDispatch };
