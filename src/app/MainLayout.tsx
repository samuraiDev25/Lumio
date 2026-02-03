'use client';

import { PropsWithChildren, useEffect } from 'react';
import { useMeQuery } from '@/features/auth/api/authApi';
import { AUTH_ROUTES } from '@/shared/lib/routes/routes';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/widgets/sidebar/ui';
import s from './MainLayout.module.scss';

/**
 * Layout for authorized application zones.
 *
 * Implementation Details:
 * 1. Performance & UX: The full-page Loader is intentionally omitted to prevent
 *    overlapping pre-rendered server content (ISR). This ensures immediate post visibility
 *    and eliminates layout shifts during hydration.
 *
 * 2. Auth Guard Logic: Manages client-side session validation.
 *    Note: This component uses inline logic instead of the generic 'useProtectedRoute'
 *    hook to implement "Silent Auth" — ignoring 401 statuses to support
 *    a seamless guest mode experience on the landing page.
 *
 * 3. Layout Stability: Uses a flex-container to preserve the Sidebar and Content
 *    structure while the session data is being fetched.
 */
export default function MainLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const { data: user, isLoading, isError } = useMeQuery();

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.replace(AUTH_ROUTES.SIGN_IN);
    }
  }, [isLoading, isError, user, router]);

  return (
    <div className={s['main-layout']}>
      <Sidebar />

      <main className={s.content}>{children}</main>
    </div>
  );
}
