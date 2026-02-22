'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import s from './ProfileTabs.module.scss';
import { PROFILE_ROUTES } from '@/shared/lib/routes';

export const ProfileTabs = () => {
  const pathname = usePathname();
  const { userId } = useParams<{ userId: string }>();
  const TABS = [
    {
      label: 'General information',
      href: PROFILE_ROUTES.SETTINGS(userId),
    },
    { label: 'Devices', href: '/profile/fill/devices' },
    { label: 'Account Management', href: '/profile/fill/account' },
    { label: 'My payments', href: '/profile/fill/payments' },
  ];
  return (
    <nav className={s.navTabs}>
      {TABS.map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          className={`${s.navTab} ${pathname === href ? s.active : ''}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};
