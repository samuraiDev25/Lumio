'use client';

import { PropsWithChildren } from 'react';
import s from '@/app/BaseLayout.module.scss';
import { useMeQuery } from '@/features/auth/api/authApi';
import { Header } from '@/widgets/header';

export const BaseLayout = ({ children }: PropsWithChildren) => {
  const { isLoading } = useMeQuery();

  if (isLoading) {
    return null;
  }

  return (
    <div className={s.layoutContainer}>
      <Header />
      {children}
    </div>
  );
};
