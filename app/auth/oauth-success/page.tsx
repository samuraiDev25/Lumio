'use client';

import { OauthCallback } from '@/features/auth/ui/oauthYandex/OauthCallback';
import { Suspense } from 'react';

export default function OauthSuccessPage() {
  return (
    <Suspense fallback={<div>Авторизация...</div>}>
      <OauthCallback />
    </Suspense>
  );
}
