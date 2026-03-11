'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import s from './ProfileTabs.module.scss';
import { PROFILE_ROUTES } from '@/shared/lib/routes';

export const ProfileTabs = () => {
  const searchParams = useSearchParams();
  const activePart = searchParams.get('part') ?? 'info';

  const TABS = [
    {
      label: 'General information',
      href: PROFILE_ROUTES.SETTINGS_PART('info'),
    },
    { label: 'Devices', href: PROFILE_ROUTES.SETTINGS_PART('devices') },
    {
      label: 'Account Management',
      href: PROFILE_ROUTES.SETTINGS_PART('account'),
    },
    { label: 'My payments', href: PROFILE_ROUTES.SETTINGS_PART('payments') },
  ];

  return (
    <nav className={s.navTabs}>
      {TABS.map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          className={`${s.navTab} ${href.includes(`part=${activePart}`) ? s.active : ''}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};
