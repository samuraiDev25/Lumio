'use client';

import { CreateNewPassword } from '@/features/auth/ui/createNewPassword/CreateNewPassword';
import { Suspense } from 'react';

export default function CreatePassword() {
  return (
    <div>
      <Suspense fallback={<div>Создание пароля...</div>}>
        <CreateNewPassword />
      </Suspense>
    </div>
  );
}
