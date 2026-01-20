'use client';

import { PropsWithChildren } from 'react';
import s from '@/app/BaseLayout.module.scss';
import { Providers } from '@/app/Providers';
import { ToastContainer } from 'react-toastify';
import { useMeQuery } from '@/features/auth/api/authApi';
import { Header } from '@/widgets/header';

export const BaseLayout = ({ children }: PropsWithChildren) => {
  const { isLoading } = useMeQuery();

  if (isLoading) {
    return null;
  }

  return (
    <div className={s.layoutContainer}>
      <Providers>
        <Header />
        {children}
        <ToastContainer position="bottom-right" autoClose={4000} />
      </Providers>
    </div>
  );
};
