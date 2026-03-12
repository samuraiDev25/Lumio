import { baseApi } from '@/shared/api/baseApi';
import {
  CreateSubscriptionPayload,
  MySubscriptionResponse,
  UpdateAutoRenewalRequest,
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
    updateAutoRenewal: builder.mutation<void, UpdateAutoRenewalRequest>({
      query: (body) => ({
        url: '/api/v1/payments/autorenewal',
        method: 'PATCH',
        body,
      }),
    }),
  }),
});

export const {
  useCreateSubscriptionPaymentMutation,
  useGetMyPaymentsQuery,
  useUpdateAutoRenewalMutation,
} = paymentsApi;
