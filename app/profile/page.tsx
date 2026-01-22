'use client';

import { LogOutButton } from '@/features/auth/ui/logout';

export default function Profile() {
  const handleLogout = () => {
    // Вся основная логика выхода (API вызов, очистка токенов, редирект) 
    // уже реализована внутри LogOutButton компонента.
    // Здесь можно добавить дополнительную логику при необходимости:
    // - Очистка кеша страницы
    // - Сброс локального состояния компонента
    // - Логирование события
    // - Обновление глобального состояния (Redux/Context) если будет добавлено
  };

  return (
    <div>
      <h1>Profile</h1>
      {/*<LogOutButton onLogout={handleLogout} />*/}
    </div>
  );
}
