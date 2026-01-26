import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '@/shared/api/baseApi';
import { baseReducer, baseSlice } from '@/shared/api';
import { authReducer, authSlice } from '@/features/auth/model/authSlice';

export const createStore = () =>
  configureStore({
    reducer: {
      [baseSlice.name]: baseReducer,
      [authSlice.name]: authReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
