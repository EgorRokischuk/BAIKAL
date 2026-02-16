import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { baseApi } from '@/api/baseApi';
import { appReducer } from './slices/appSlice';
import { authReducer } from './slices/authSlice';
import { mapReducer } from './slices/mapSlice';
import { geeReducer } from './slices/geeSlice';
import { tokenRefreshMiddleware } from './middleware/tokenRefreshListener';

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  app: appReducer,
  auth: authReducer,
  map: mapReducer,
  gee: geeReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware, tokenRefreshMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
