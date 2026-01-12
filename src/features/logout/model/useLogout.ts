import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser, clearAuthData, getUserEmail } from '@/features/logout/api';

export const useLogout = (onLogout?: () => void) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await logoutUser();

    if (result.success) {
      clearAuthData();
      onLogout?.();
      
      try {
        router.push('/auth/sign-in');
      } catch (routerError) {
        console.error('Router error:', routerError);
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/sign-in';
        }
      }
    } else {
      setError(result.error || 'An error occurred during logout');
    }

    setIsLoading(false);
  };

  return {
    handleLogout,
    isLoading,
    error,
    getUserEmail,
  };
};

