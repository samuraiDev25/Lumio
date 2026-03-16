'use client';

import { Typography, Pagination } from '@/shared/ui';
import { Loading } from '@/shared/ui/loading/Loading';
import { PaymentsTable } from '@/features/payments/ui/PaymentsTable/PaymentsTable';
import { useMyPayments } from '@/features/payments/hooks/useMyPayments';
import s from './ProfilePayments.module.scss';

export function ProfilePayments() {
  const {
    data,
    isLoading,
    isFetching,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
  } = useMyPayments();

  const pagesCount = data?.pagesCount ?? 1;

  return (
    <div className={s.wrapper}>
      <Typography variant="h1" className={s.title}>
        My payments
      </Typography>

      {isLoading && (
        <div className={s.loading}>
          <Loading />
        </div>
      )}
      {error && !isLoading && (
        <div className={s.error}>
          <Typography variant="regular_text_16">
            Failed to load payments. Please try again later.
          </Typography>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <PaymentsTable payments={data?.items ?? []} />

          {pagesCount > 1 && (
            <div className={s.pagination}>
              <Pagination
                totalPages={pagesCount}
                initialPage={page}
                initialPageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </div>
          )}

          {isFetching && !isLoading && (
            <div className={s.loadingInline}>
              <Loading />
            </div>
          )}
        </>
      )}
    </div>
  );
}
