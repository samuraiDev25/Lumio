'use client';

import MainLayout from '@/app/MainLayout';
import { ReactNode } from 'react';

export default function Layout({
  children,
  modal,
}: Readonly<{
  children: ReactNode;
  modal: ReactNode;
}>) {
  return (
    <MainLayout>
      {children}
      {modal}
    </MainLayout>
  );
}
