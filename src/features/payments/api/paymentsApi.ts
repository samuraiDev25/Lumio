import { baseApi } from '@/shared/api/baseApi';
import {
  CreateSubscriptionPayload,
  MySubscriptionResponse,
} from '@/features/payments/model/types/paymentsTypes';

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
    getMyPayments: builder.query<MySubscriptionResponse, void>({
      query: () => ({
        url: '/api/v1/payments/my-subscription',
      }),
    }),
  }),
});

export const { useCreateSubscriptionPaymentMutation, useGetMyPaymentsQuery } =
  paymentsApi;
