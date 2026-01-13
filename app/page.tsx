'use client';

import { useMeQuery } from '@/features/auth/api/authApi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data: user, isLoading, isError } = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.replace('/auth/sign-in');
    }
  }, [isLoading, isError, user, router]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>MAIN PAGE</h1>
      <div>
        <div>Имя {user.username}</div>
        <div>id: {user.userId}</div>
        <div>email: {user.email}</div>
      </div>
    </div>
  );
}
