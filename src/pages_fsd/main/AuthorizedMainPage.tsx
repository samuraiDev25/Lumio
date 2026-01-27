'use client';

import { useProtectedRoute } from '@/shared/hooks/useProtectedRoute';

export function AuthorizedMainPage() {
  const { user, isLoading, isAuthorized } = useProtectedRoute();

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div style={{ marginLeft: '15em' }}>
      <h1>MAIN PAGE FOR AUTHORIZED USER</h1>
      <div>
        <div>Имя {user?.username}</div>
        <div>id: {user?.userId}</div>
        <div>email: {user?.email}</div>
      </div>
    </div>
  );
}
