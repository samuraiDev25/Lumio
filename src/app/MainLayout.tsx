'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { useMeQuery } from '@/features/auth/api/authApi';
import { APP_ROUTES } from '@/shared/lib/routes/routes';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/widgets/sidebar/ui';
import { Loading } from '@/shared/ui/loading/Loading';
import s from './MainLayout.module.scss';
import { CreatePostDialog } from '@/entities/post';
type Props = PropsWithChildren<{
  requireAuth?: boolean;
}>;
export default function MainLayout({ children, requireAuth = true }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading, isError } = useMeQuery();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    const isPublicRoute =
      pathname === APP_ROUTES.ROOT ||
      pathname.startsWith('/auth') ||
      pathname.startsWith('/profile') ||
      pathname.startsWith('/users') ||
      pathname.startsWith('/posts');

    if (isPublicRoute) return;
    if (!requireAuth) return;

    if (!isLoading && (isError || !user)) {
      router.replace(APP_ROUTES.ROOT);
    }
  }, [isLoading, isError, user, router, requireAuth, pathname]);

  const handleSidebarAction = (id: string) => {
    if (id === 'create') {
      setIsCreateOpen(true);
    }
  };

  if (isLoading && requireAuth) {
    return <Loading />;
  }

  return (
    <div className={s['main-layout']}>
      {user ? <Sidebar onItemClickAction={handleSidebarAction} /> : null}

      <main className={s.content}>{children}</main>
      <CreatePostDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
