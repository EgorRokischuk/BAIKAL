import { configureStore } from '@reduxjs/toolkit';
import { mapReducer } from '@/entities/Map';
import { globalReducer } from '../model/globalReducer';

const createReduxStore = () => {
	return configureStore({
		reducer: {
			global: globalReducer,
			map: mapReducer,
		},
	});
};

const _store = createReduxStore();

type RootState = ReturnType<typeof _store.getState>;
type AppDispatch = typeof _store.dispatch;

export { createReduxStore, type RootState, type AppDispatch };
