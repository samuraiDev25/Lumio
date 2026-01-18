import { baseApi } from '@/shared/api/baseApi';
import {
  AuthResponse,
  LoginRequest,
  MeResponse,
  RefreshTokenResponse,
  InputRegistrationDto,
  RegistrationConfirmationInputDto,
  RecoveryPasswordRequest,
  CreateNewPasswordRequest,
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
    registration: builder.mutation<void, InputRegistrationDto>({
      query: (data) => ({
        url: '/api/v1/auth/registration',
        method: 'POST',
        body: data,
      }),
    }),
    confirmEmail: builder.mutation<void, RegistrationConfirmationInputDto>({
      query: (data) => ({
        url: '/api/v1/auth/registration-confirmation',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/api/v1/auth/logout',
        method: 'POST',
      }),
    }),
    recoveryPassword: builder.mutation<void, RecoveryPasswordRequest>({
      query: (data) => ({
        url: '/api/v1/auth/password-recovery',
        method: 'POST',
        body: data,
      }),
    }),
    createNewPassword: builder.mutation<void, CreateNewPasswordRequest>({
      query: (body) => ({
        url: '/api/v1/auth/new-password',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useMeQuery,
  useRefreshTokenMutation,
  useRegistrationMutation,
  useConfirmEmailMutation,
  useLogoutMutation,
  useRecoveryPasswordMutation,
  useCreateNewPasswordMutation,
} = authApi;
