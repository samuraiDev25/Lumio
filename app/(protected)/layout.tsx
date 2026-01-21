'use client';

import { MainLayout } from '@/app/MainLayout';
import React from 'react';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <MainLayout>{children}</MainLayout>;
}
