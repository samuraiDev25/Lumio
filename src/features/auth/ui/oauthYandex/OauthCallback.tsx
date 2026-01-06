'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from './ui/Loader';

export function OauthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('accessToken');

    if (token) {
      localStorage.setItem('accessToken', token);
      router.replace('/');
    } else {
      router.replace('/auth/sign-in');
    }
  }, [searchParams, router]);

  return <Loader />;
}
