import {
  GetMyPaymentsRequest,
  GetMyPaymentsResponse,
  Payment,
} from '@/features/payments/api/paymentsApi.types';

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 1,
    createdAt: '2026-03-01T10:30:00Z',
    amount: 29.99,
    currency: 'USD',
    subscriptionType: 'Premium Monthly',
    paymentService: 'Stripe',
    status: 'completed',
  },
  {
    id: 2,
    createdAt: '2026-02-15T14:20:00Z',
    amount: 299.99,
    currency: 'USD',
    subscriptionType: 'Premium Yearly',
    paymentService: 'PayPal',
    status: 'completed',
  },
  {
    id: 3,
    createdAt: '2026-02-01T09:10:00Z',
    amount: 9.99,
    currency: 'USD',
    subscriptionType: 'Basic Monthly',
    paymentService: 'Apple Pay',
    status: 'completed',
  },
  {
    id: 4,
    createdAt: '2026-01-28T18:45:00Z',
    amount: 49.99,
    currency: 'USD',
    subscriptionType: 'Pro Monthly',
    paymentService: 'Google Pay',
    status: 'completed',
  },
  {
    id: 5,
    createdAt: '2026-01-15T12:00:00Z',
    amount: 29.99,
    currency: 'USD',
    subscriptionType: 'Premium Monthly',
    paymentService: 'Stripe',
    status: 'completed',
  },
  {
    id: 6,
    createdAt: '2026-01-01T08:30:00Z',
    amount: 9.99,
    currency: 'USD',
    subscriptionType: 'Basic Monthly',
    paymentService: 'PayPal',
    status: 'completed',
  },
  {
    id: 7,
    createdAt: '2025-12-20T16:15:00Z',
    amount: 299.99,
    currency: 'USD',
    subscriptionType: 'Premium Yearly',
    paymentService: 'Stripe',
    status: 'completed',
  },
  {
    id: 8,
    createdAt: '2025-12-05T11:05:00Z',
    amount: 49.99,
    currency: 'USD',
    subscriptionType: 'Pro Monthly',
    paymentService: 'Apple Pay',
    status: 'completed',
  },
  {
    id: 9,
    createdAt: '2025-11-25T19:25:00Z',
    amount: 29.99,
    currency: 'USD',
    subscriptionType: 'Premium Monthly',
    paymentService: 'Google Pay',
    status: 'completed',
  },
  {
    id: 10,
    createdAt: '2025-11-10T07:50:00Z',
    amount: 9.99,
    currency: 'USD',
    subscriptionType: 'Basic Monthly',
    paymentService: 'Stripe',
    status: 'completed',
  },
  {
    id: 11,
    createdAt: '2025-10-30T13:40:00Z',
    amount: 49.99,
    currency: 'USD',
    subscriptionType: 'Pro Monthly',
    paymentService: 'PayPal',
    status: 'completed',
  },
  {
    id: 12,
    createdAt: '2025-10-15T10:10:00Z',
    amount: 29.99,
    currency: 'USD',
    subscriptionType: 'Premium Monthly',
    paymentService: 'Apple Pay',
    status: 'completed',
  },
  {
    id: 13,
    createdAt: '2025-10-01T09:00:00Z',
    amount: 9.99,
    currency: 'USD',
    subscriptionType: 'Basic Monthly',
    paymentService: 'Google Pay',
    status: 'completed',
  },
  {
    id: 14,
    createdAt: '2025-09-20T15:30:00Z',
    amount: 299.99,
    currency: 'USD',
    subscriptionType: 'Premium Yearly',
    paymentService: 'Stripe',
    status: 'completed',
  },
  {
    id: 15,
    createdAt: '2025-09-05T17:45:00Z',
    amount: 49.99,
    currency: 'USD',
    subscriptionType: 'Pro Monthly',
    paymentService: 'PayPal',
    status: 'completed',
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getMyPayments(
  params: GetMyPaymentsRequest = {},
): Promise<GetMyPaymentsResponse> {
  const { pageNumber = 1, pageSize = 10 } = params;

  const sorted = [...MOCK_PAYMENTS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const totalCount = sorted.length;
  const pagesCount = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(Math.max(pageNumber, 1), pagesCount);

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = sorted.slice(startIndex, endIndex);

  const minDelay = 500;
  const maxDelay = 1000;
  const randomDelay = Math.floor(
    Math.random() * (maxDelay - minDelay + 1) + minDelay,
  );

  await delay(randomDelay);

  return {
    pagesCount,
    page: safePage,
    pageSize,
    totalCount,
    items,
  };
}
