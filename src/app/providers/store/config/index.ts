import { configureStore } from '@reduxjs/toolkit';
import { globalReducer } from '../model/globalReducer';
import { mapReducer } from '@/entities/Map';

const createReduxStore = () => {
	return configureStore({
		reducer: {
			global: globalReducer,
			map: mapReducer,
		},
	});
};

const store = createReduxStore();

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export { createReduxStore, type RootState, type AppDispatch };
