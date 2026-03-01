'use client';

import { useEffect, ReactNode } from 'react';
import { useMeQuery } from '@/features/auth/api/authApi';
import { BaseLayout } from '@/app/BaseLayout';
import MainLayout from '@/app/MainLayout';
import { Post } from '@/entities/post/model/types/postApi.types';
import { handleNetworkError } from '@/shared/lib';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useAppDispatch } from '@/shared/hooks';
import { PostsFeed } from './PostsFeed';

type MainPageProps = {
  serverPosts: Post[];
  serverUsersCount: number;
};

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
      <PostsFeed posts={serverPosts} usersCount={serverUsersCount} />
    </PageLayout>
  );
}
