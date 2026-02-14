'use client';

import { useMeQuery } from '@/features/auth/api/authApi';
import { UnauthorizedMainPage } from './UnauthorizedMainPage';
import { AuthorizedMainPage } from './AuthorizedMainPage';
import { Post } from '@/entities/post/model/types/postApi.types';
import { handleNetworkError } from '@/shared/lib';
import { useEffect } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useAppDispatch } from '@/shared/hooks';

type MainPageClientWrapperProps = {
  serverPosts: Post[];
  serverUsersCount: number;
};

/**
 * Client-side wrapper component for the Home Page.
 *
 * Logic:
 * 1. Auth Status: Checks authorization via 'useMeQuery'.
 * 2. Rendering: While loading or if unauthenticated, renders 'UnauthorizedMainPage'.
 *    Once authenticated, switches to 'AuthorizedMainPage'.
 * 3. Silent Auth: Implements silent error handling for guests by ignoring 401 statuses.
 *
 * Note: We manage the auth check here instead of using the generic 'useProtectedRoute' hook
 * to ensure that unauthenticated guests can still view the public landing page
 * content without being redirected to the Sign-In page.
 */
export function MainPageClientWrapper({
  serverPosts,
  serverUsersCount,
}: MainPageClientWrapperProps) {
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
  if (isLoading || !user) {
    return (
      <UnauthorizedMainPage posts={serverPosts} usersCount={serverUsersCount} />
    );
  }
  return (
    <AuthorizedMainPage posts={serverPosts} usersCount={serverUsersCount} />
  );
}
