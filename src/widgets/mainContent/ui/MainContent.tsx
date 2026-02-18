'use client';

import { useMeQuery } from '@/features/auth/api/authApi';
import { UsersCount } from '@/shared/ui/users-count/UsersCount';
import { PostCard } from '@/entities/post/ui/PostCard/PostCard';
import { BaseLayout } from '@/app/BaseLayout';
import MainLayout from '@/app/MainLayout';
import s from './MainContent.module.scss';
import { Post } from '@/entities/post/model/types/postApi.types';
import { handleNetworkError } from '@/shared/lib';
import { useEffect, ReactNode } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useAppDispatch } from '@/shared/hooks';

type MainPageProps = {
  serverPosts: Post[];
  serverUsersCount: number;
};

function MainContent({
  posts,
  usersCount,
}: {
  posts: Post[];
  usersCount: number;
}) {
  return (
    <div className={s.main}>
      <div className={s['users-count-wrapper']}>
        <UsersCount count={usersCount} />
      </div>

      <div className={s['posts-grid']}>
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className={s['no-posts']}>
            Постов пока нет, но они скоро появятся!
          </div>
        )}
      </div>
    </div>
  );
}

function PageLayout({
  children,
  isAuthorized,
}: {
  children: ReactNode;
  isAuthorized: boolean;
}) {
  return isAuthorized ? (
    <MainLayout>{children}</MainLayout>
  ) : (
    <BaseLayout>{children}</BaseLayout>
  );
}

export function MainPage({ serverPosts, serverUsersCount }: MainPageProps) {
  const { data: user, isLoading, error, isError } = useMeQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchError = error as FetchBaseQueryError;

    if (isError && fetchError?.status === 401) {
      return;
    }
    if (isError && error) {
      handleNetworkError({ error, dispatch });
    }
  }, [isError, error, dispatch]);

  const isAuthorized = !isLoading && !!user;

  return (
    <PageLayout isAuthorized={isAuthorized}>
      <MainContent posts={serverPosts} usersCount={serverUsersCount} />
    </PageLayout>
  );
}
