import { configureStore } from '@reduxjs/toolkit';
import { mapReducer } from '@/entities/map';
import { baseApi } from '@/shared/config/api/baseApi';
import { globalReducer } from '../model/globalReducer';

const createReduxStore = () => {
	return configureStore({
		reducer: {
			[baseApi.reducerPath]: baseApi.reducer,
			global: globalReducer,
			map: mapReducer,
		},
		middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
	});
};

const _store = createReduxStore();

type RootState = ReturnType<typeof _store.getState>;
type AppDispatch = typeof _store.dispatch;

export { createReduxStore, type RootState, type AppDispatch };
