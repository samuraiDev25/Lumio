'use client';

import { PropsWithChildren, useEffect } from 'react';
import { useMeQuery } from '@/features/auth/api/authApi';
import { AUTH_ROUTES } from '@/shared/lib/routes/routes';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/widgets/sidebar/ui';
import s from './BaseLayout.module.scss';
import { Loading } from '@/shared/ui/loading/Loading';

export default function MainLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const { data: user, isLoading, isError } = useMeQuery();

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.replace(AUTH_ROUTES.SIGN_IN);
    }
  }, [isLoading, isError, user, router]);

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={s.mainLayout}>
      <Sidebar />
      <main style={{ flex: '1', padding: '2rem' }}>{children}</main>
    </div>
  );
}
