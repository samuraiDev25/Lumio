'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMeQuery } from '@/features/auth/api/authApi';
import { APP_ROUTES } from '@/shared/lib/routes';

type Options = {
  redirect?: boolean;
};

export const useProtectedRoute = (options: Options = {}) => {
  const { redirect = true } = options;
  const router = useRouter();
  const { data: user, isLoading, isError } = useMeQuery();

  useEffect(() => {
    if (!redirect) return;

    if (!isLoading && (isError || !user)) {
      router.replace(APP_ROUTES.ROOT);
    }
  }, [redirect, isLoading, isError, user, router]);

  return {
    user,
    isLoading,
    isError,
    isAuthorized: Boolean(user),
  };
};
