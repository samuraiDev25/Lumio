'use client';

import { LogOutButton } from '@/features/logout/ui';

export default function Profile() {
  const handleLogout = () => {
    // TODO: Добавить логику выхода из системы
    console.log('Logout from profile');
  };

  return (
    <div>
      <h1>Profile</h1>
      <LogOutButton onLogout={handleLogout} />
    </div>
  );
}
