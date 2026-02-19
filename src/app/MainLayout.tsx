'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { useMeQuery } from '@/features/auth/api/authApi';
import { APP_ROUTES } from '@/shared/lib/routes/routes';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/widgets/sidebar/ui';
import { Loading } from '@/shared/ui/loading/Loading';
import s from './MainLayout.module.scss';
import { CreatePostDialog } from '@/entities/post';

export default function MainLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const { data: user, isLoading, isError } = useMeQuery();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && false && (isError || !user)) {
      router.replace(APP_ROUTES.ROOT);
    }
  }, [isLoading, isError, user, router]);

  const handleSidebarAction = (id: string) => {
    if (id === 'create') {
      setIsCreateOpen(true);
    }
  };

  if (isLoading) {
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
