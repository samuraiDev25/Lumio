// authApi.ts
import { baseApi } from '@/shared/api/baseApi';
import { MeResponse, RefreshTokenResponse } from "@/features/auth/api/authApi.types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.query<MeResponse, void>({
      query: () => ({ url: '/api/v1/auth/me' }),
      providesTags: ['Me'],
    }),
    refreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({ url: '/api/v1/auth/refresh-token' }),
    }),
  }),
});

export const { useMeQuery } = authApi;
