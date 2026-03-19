'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GeneralInformation } from '@/widgets/ProfileGeneralInfo';
import { ProfileAccount } from '@/widgets/ProfileAccount/ui/ProfileAccount';
import { ProfilePayments } from '@/widgets/ProfilePayments/ui/ProfilePayments';
import { ProfileDevices } from '@/widgets/ProfileDevices/ui/ProfileDevices';

const VALID_PARTS = ['info', 'devices', 'account', 'payments'] as const;

type SettingsPart = (typeof VALID_PARTS)[number];

const isValidPart = (part: string): part is SettingsPart =>
  VALID_PARTS.includes(part as SettingsPart);

export const SettingsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const part = searchParams.get('part');

  useEffect(() => {
    if (!part || !isValidPart(part)) {
      router.replace('/settings?part=info', { scroll: false });
    }
  }, [part, router]);

  if (!part || !isValidPart(part)) {
    return null;
  }

  if (part === 'info') {
    return <GeneralInformation />;
  }

  if (part === 'account') {
    return <ProfileAccount />;
  }

  if (part === 'devices') {
    return <ProfileDevices />;
  }

  return <ProfilePayments />;
};
