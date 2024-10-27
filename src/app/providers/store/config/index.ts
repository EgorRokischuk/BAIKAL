import { configureStore } from '@reduxjs/toolkit';
import { globalReducer } from '../model/globalReducer';

const createReduxStore = () => {
	return configureStore({
		reducer: {
			global: globalReducer,
		},
	});
};

const store = createReduxStore();

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export { createReduxStore, type RootState, type AppDispatch };
