import { configureStore } from '@reduxjs/toolkit';

const createReduxStore = () => {
	return configureStore({
		reducer: {},
	});
};

const store = createReduxStore();

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export { createReduxStore, type RootState, type AppDispatch };
