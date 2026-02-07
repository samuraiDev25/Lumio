'use client';

import MainLayout from '@/app/MainLayout';
import React from 'react';

export default function Layout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <MainLayout>
      {children}
      {modal}
    </MainLayout>
  );
}
