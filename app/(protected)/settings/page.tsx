import { ProfileTabs } from '@/widgets/ProfileTabs/ui/ProfileTabs';
import { redirect } from 'next/navigation';
import { GeneralInformation } from '@/widgets/ProfileGeneralInfo';
import { ProfileAccount } from '@/widgets/ProfileAccount/ui/ProfileAccount';
import { ProfilePayments } from '@/widgets/ProfilePayments/ui/ProfilePayments';
import { ProfileDevices } from '@/widgets/ProfileDevices/ui/ProfileDevices';

const VALID_PARTS = ['info', 'devices', 'account', 'payments'] as const;

type SettingsPart = (typeof VALID_PARTS)[number];

const isValidPart = (part: string): part is SettingsPart =>
  VALID_PARTS.includes(part as SettingsPart);

type SettingsPageProps = {
  searchParams: Promise<{
    part?: string | string[];
  }>;
};

export default async function ProfileSettingsPage({
  searchParams,
}: SettingsPageProps) {
  const params = await searchParams;
  const part = Array.isArray(params.part) ? params.part[0] : params.part;

  if (!part || !isValidPart(part)) {
    redirect('/settings?part=info');
  }

  return (
    <>
      <ProfileTabs />
      {part === 'info' && <GeneralInformation />}
      {part === 'account' && <ProfileAccount />}
      {part === 'devices' && <ProfileDevices />}
      {part === 'payments' && <ProfilePayments />}
    </>
  );
}
