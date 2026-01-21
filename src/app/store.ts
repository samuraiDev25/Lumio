import { configureStore } from '@reduxjs/toolkit';
import { baseApi, baseReducer, baseSlice } from '@/shared/api';
import { authSlice, authReducer } from '@/features/auth/model/authSlice';

export const store = (): ReturnType<typeof configureStore> =>
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

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = ReturnType<AppStore['dispatch']>;
