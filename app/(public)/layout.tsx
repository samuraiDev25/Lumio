'use client';

import MainLayout from '@/app/MainLayout';
import { ReactNode } from 'react';

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <MainLayout requireAuth={false}>{children}</MainLayout>;
}
