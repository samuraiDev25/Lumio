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
import { MOCK_PAYMENTS } from '@/features/payments/api/paymentsService';

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

    getMyPayments: builder.query<
      GetMyPaymentsResponse,
      GetMyPaymentsRequest | undefined
    >({
      query: (params) => ({
        url: '/api/v1/payments/my-payments',
        method: 'GET',
        params,
      }),
      // TODO: remove mock when backend has real data
      transformResponse: (
        response: GetMyPaymentsResponse,
        _meta,
        arg?: GetMyPaymentsRequest,
      ): GetMyPaymentsResponse => {
        if (response.totalCount !== 0) {
          return response;
        }

        const pageSize = response.pageSize || arg?.pageSize || 10;
        const page = response.page || arg?.pageNumber || 1;

        const pagesCount = Math.ceil(MOCK_PAYMENTS.length / pageSize);

        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;

        return {
          ...response,
          pagesCount,
          page,
          pageSize,
          totalCount: MOCK_PAYMENTS.length,
          items: MOCK_PAYMENTS.slice(startIndex, endIndex),
        };
      },
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
