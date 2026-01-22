'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from './ui/Loader';
import { APP_ROUTES, AUTH_ROUTES } from '@/shared/lib/routes';

export function OauthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('accessToken');

    if (token) {
      localStorage.setItem('accessToken', token);
      router.replace(APP_ROUTES.ROOT);
    } else {
      router.replace(AUTH_ROUTES.SIGN_IN);
    }
  }, [searchParams, router]);

  return <Loader />;
}
