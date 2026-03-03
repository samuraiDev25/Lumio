import { ProfileTabs } from '@/pages_fsd/profile/ui/ProfileTabs/ProfileTabs';
import { GeneralInformation } from '@/pages_fsd/profile';
import { redirect } from 'next/navigation';

const VALID_PARTS = ['info', 'devices', 'subscriptions', 'payments'] as const;

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
    </>
  );
}
