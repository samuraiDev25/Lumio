import { baseApi } from '@/shared/api/baseApi';
import {
  CreateSubscriptionPayload,
  MySubscriptionResponse,
  UpdateAutoRenewalRequest,
} from '@/features/payments/model/types/paymentsTypes';
import {
  GetMyPaymentsRequest,
  GetMyPaymentsResponse,
} from '@/features/payments/api/paymentsApi.types';

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

    getMyPayments: builder.query<GetMyPaymentsResponse, GetMyPaymentsRequest>({
      query: (params) => ({
        url: '/api/v1/payments/my-payments',
        method: 'GET',
        params,
      }),
    }),

    updateAutoRenewal: builder.mutation<void, UpdateAutoRenewalRequest>({
      query: (body) => ({
        url: '/api/v1/payments/autorenewal',
        method: 'PATCH',
        body,
      }),
    }),

    getMySubscription: builder.query<MySubscriptionResponse, void>({
      query: () => ({
        url: '/api/v1/payments/my-subscription',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useCreateSubscriptionPaymentMutation,
  useGetMyPaymentsQuery,
  useUpdateAutoRenewalMutation,
  useGetMySubscriptionQuery,
} = paymentsApi;
