import { baseApi } from '@/shared/api/baseApi';
import {
  AuthResponse,
  LoginRequest,
  MeResponse,
  RefreshTokenResponse,
} from '@/features/auth/api/authApi.types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/api/v1/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    me: builder.query<MeResponse, void>({
      query: () => ({ url: '/api/v1/auth/me' }),
      providesTags: ['Me'],
    }),
    refreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: '/api/v1/auth/refresh-token',
        method: 'POST',
      }),
    }),
  }),
});

export const { useLoginMutation, useMeQuery, useRefreshTokenMutation } =
  authApi;
