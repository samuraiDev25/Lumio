'use client';

import { useMeQuery } from '@/features/auth/api/authApi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function UnauthorizedMainPage() {
  const { data: user, isLoading } = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/main'); // маршрут внутри (protected)
    }
  }, [isLoading, user, router]);
  if (isLoading) return null;
  return (
    <div>
      <h1>Welcome to Inctagram</h1>
    </div>
  );
}
