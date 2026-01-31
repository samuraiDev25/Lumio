'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMeQuery } from '@/features/auth/api/authApi';
import { getUserProfileRoute } from '@/shared/lib/routes';
import { Loading } from '@/shared/ui/loading/Loading';

export default function ProfilePage() {
  const router = useRouter();
  const { data: currentUser, isLoading } = useMeQuery();

  useEffect(() => {
    if (!isLoading && currentUser?.userId) {
      router.replace(getUserProfileRoute(currentUser.userId));
    }
  }, [currentUser, isLoading, router]);

  if (isLoading) {
    return <Loading />;
  }

  return null;
}
