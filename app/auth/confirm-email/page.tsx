'use client';

import { ConfirmEmail } from '@/features/auth/ui/confirmEmail/ConfirmEmail';
import { Suspense } from 'react';

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <ConfirmEmail />
    </Suspense>
  );
}
