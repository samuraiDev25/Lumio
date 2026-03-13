import { baseApi } from '@/shared/api/baseApi';
import { CreateSubscriptionPayload } from '@/features/payments/modal/types/paymentsTypes';

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSubscriptionPayment: builder.mutation<
      { url: string },
      CreateSubscriptionPayload
    >({
      query: (body) => ({
        url: '/api/v1/payments',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCreateSubscriptionPaymentMutation } = paymentsApi;
