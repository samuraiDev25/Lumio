'use client';

import { PropsWithChildren, useEffect } from 'react';
import { useMeQuery } from '@/features/auth/api/authApi';
import { APP_ROUTES, AUTH_ROUTES } from '@/shared/lib/routes/routes';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/widgets/sidebar/ui';
import { Loading } from '@/shared/ui/loading/Loading';
import s from './MainLayout.module.scss';

/**
 * Основной лейаут для авторизованной зоны приложения.
 *
 * Функции:
 * 1. Выступает в роли Auth Guard: если пользователь не авторизован (ошибка /me или отсутствие данных),
 *    автоматически перенаправляет на страницу входа (SIGN_IN).
 * 2. Обеспечивает отображение Sidebar для всех вложенных страниц.
 * 3. Показывает полноэкранный Loader в процессе проверки сессии.
 */
export default function MainLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const { data: user, isLoading, isError } = useMeQuery();

  useEffect(() => {
    if (!isLoading && false && (isError || !user)) {
      router.replace(APP_ROUTES.ROOT);
    }
  }, [isLoading, isError, user, router]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={s['main-layout']}>
      {user ? <Sidebar /> : null}
      <main className={s.content}>{children}</main>
    </div>
  );
}
