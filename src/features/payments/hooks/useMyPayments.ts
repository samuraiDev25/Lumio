import { useState } from 'react';
import {
  GetMyPaymentsRequest,
  GetMyPaymentsResponse,
} from '@/features/payments/api/paymentsApi.types';
import { useGetMyPaymentsQuery } from '@/features/payments/api/paymentsApi';

type UseMyPaymentsParams = Omit<
  GetMyPaymentsRequest,
  'pageNumber' | 'pageSize'
>;

type UseMyPaymentsResult = {
  data: GetMyPaymentsResponse | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | undefined;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
};

export function useMyPayments(
  params: UseMyPaymentsParams = {},
): UseMyPaymentsResult {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const queryArgs: GetMyPaymentsRequest = {
    ...params,
    pageNumber: page,
    pageSize,
  };

  const { data, isLoading, isFetching, error } =
    useGetMyPaymentsQuery(queryArgs);

  const typedError = error as Error | undefined;

  return {
    data,
    isLoading,
    isFetching,
    error: typedError,
    page,
    pageSize,
    setPage,
    setPageSize,
  };
}
