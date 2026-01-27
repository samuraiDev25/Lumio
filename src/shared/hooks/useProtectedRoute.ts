'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMeQuery } from '@/features/auth/api/authApi';
import { AUTH_ROUTES } from '@/shared/lib/routes';

export const useProtectedRoute = () => {
  const router = useRouter();
  const { data: user, isLoading, isError } = useMeQuery();

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.replace(AUTH_ROUTES.SIGN_IN);
    }
  }, [isLoading, isError, user, router]);

  return {
    user,
    isLoading,
    isError,
    isAuthorized: Boolean(user),
  };
};
