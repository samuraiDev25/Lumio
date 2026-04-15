'use client';

import { useEffect, ReactNode } from 'react';
import { useMeQuery } from '@/features/auth/api/authApi';
import { BaseLayout } from '@/app/BaseLayout';
import MainLayout from '@/app/MainLayout';
import { Post } from '@/entities/post/model/types/postApi.types';
import type { UserProfile } from '@/pages_fsd/profile/modal/types/profileApi.types';
import { handleNetworkError } from '@/shared/lib';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useAppDispatch } from '@/shared/hooks';
import { PostsFeed } from './PostsFeed';

type MainPageProps = {
  serverPosts: Post[];
  serverPagesCount: number;
  serverUsersCount: number;
  profileByUserId: Record<number, UserProfile | null>;
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

export function MainPage({
  serverPosts,
  serverPagesCount,
  serverUsersCount,
  profileByUserId,
}: MainPageProps) {
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
      <PostsFeed
        posts={serverPosts}
        pagesCount={serverPagesCount}
        usersCount={serverUsersCount}
        profileByUserId={profileByUserId}
      />
    </PageLayout>
  );
}
