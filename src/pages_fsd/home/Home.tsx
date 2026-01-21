'use client';

import { useRouter } from 'next/navigation';
import { AUTH_ROUTES, PROFILE_ROUTES } from '@/shared/lib/routes';
import { useEffect } from 'react';
import { useMeQuery } from '@/features/auth/api/authApi';

export function Home() {
  const router = useRouter();
  const { data } = useMeQuery();

  useEffect(() => {
    if (!data) {
      router.replace(AUTH_ROUTES.SIGN_IN);
    } else {
      router.replace(PROFILE_ROUTES.SETTINGS);
    }
  }, [data]);

  return null;
}
