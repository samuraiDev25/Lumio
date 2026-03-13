'use client';

import PrivacyPolicy from '@/features/auth/ui/legalLinks/PrivacyPolicy';
import { Suspense } from 'react';

export default function Terms() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <PrivacyPolicy />
    </Suspense>
  );
}
