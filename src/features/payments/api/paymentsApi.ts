import { baseApi } from '@/shared/api/baseApi';
import { CreateSubscriptionPayload } from '@/features/payments/modal/types/paymentsTypes';
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
      GetMyPaymentsRequest | void
    >({
      query: (params) => {
        const {
          pageNumber = 1,
          pageSize = 10,
          sortBy = 'createdAt',
          sortDirection = 'desc',
        } = params || {};

        return {
          url: '/api/v1/payments/my-payments',
          params: {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
          },
        };
      },
      // TODO: remove mock after real payments exist
      transformResponse: (
        response: GetMyPaymentsResponse,
        _meta,
        arg?: GetMyPaymentsRequest,
      ): GetMyPaymentsResponse => {
        if (response.totalCount && response.totalCount > 0) {
          return response;
        }

        const pageSize = arg?.pageSize ?? 10;
        const pagesCount = Math.max(
          1,
          Math.ceil(MOCK_PAYMENTS.length / pageSize),
        );

        const requestedPage = arg?.pageNumber ?? 1;
        const page =
          requestedPage > pagesCount ? pagesCount : Math.max(requestedPage, 1);

        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        const items = MOCK_PAYMENTS.slice(startIndex, endIndex);

        return {
          pagesCount,
          page,
          pageSize,
          totalCount: MOCK_PAYMENTS.length,
          items,
        };
      },
    }),
  }),
});

export const { useCreateSubscriptionPaymentMutation, useGetMyPaymentsQuery } =
  paymentsApi;
