import { baseApi } from '@/shared/api';

type RecoveryPasswordRequest = {
  email: string;
  recaptcha: string;
  baseUrl: string;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    recoveryPassword: builder.mutation<void, RecoveryPasswordRequest>({
      query: (body) => ({
        url: '/api/v1/auth/password-recovery',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useRecoveryPasswordMutation } = authApi;
