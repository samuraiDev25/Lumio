import { baseApi } from '@/shared/api';
import {
  CreateNewPasswordRequest,
  LoginRequest,
  LoginResponse,
  MeResponse,
  RegistrationArgs,
  RegistrationConfirmationArgs,
  RegistrationEmailResendingArgs,
} from '@/entities/auth/api/authApi.types';

type RecoveryPasswordRequest = {
  email: string;
  recaptcha: string;
  baseUrl: string;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (obj) => ({
        url: '/api/v1/auth/login',
        method: 'POST',
        body: obj,
      }),
      invalidatesTags: ['Me'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/api/v1/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Me'],
    }),
    me: builder.query<MeResponse, void>({
      query: () => ({
        url: '/api/v1/auth/me',
        method: 'GET',
      }),
      providesTags: ['Me'],
    }),
    registration: builder.mutation<void, RegistrationArgs>({
      query: (body) => ({
        url: '/api/v1/auth/registration',
        method: 'POST',
        body,
      }),
    }),
    registrationConfirmation: builder.mutation<
      void,
      RegistrationConfirmationArgs
    >({
      query: (body) => ({
        url: '/api/v1/auth/registration-confirmation',
        method: 'POST',
        body,
      }),
    }),
    registrationEmailResending: builder.mutation<
      void,
      RegistrationEmailResendingArgs
    >({
      query: (body) => ({
        url: '/api/v1/auth/registration-email-resending',
        method: 'POST',
        body,
      }),
    }),
    recoveryPassword: builder.mutation<void, RecoveryPasswordRequest>({
      query: (body) => ({
        url: '/api/v1/auth/password-recovery',
        method: 'POST',
        body,
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
  useMeQuery,
  useLoginMutation,
  useLazyMeQuery,
  useRegistrationMutation,
  useRegistrationConfirmationMutation,
  useRegistrationEmailResendingMutation,
  useRecoveryPasswordMutation,
  useLogoutMutation,
  useCreateNewPasswordMutation,
} = authApi;
