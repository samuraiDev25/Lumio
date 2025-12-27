'use client';

import { PropsWithChildren } from 'react';
import s from '@/app/BaseLayout.module.scss';
import { Header } from '@/widgets/header/ui';
import { Sidebar } from '@/widgets/sidebar';

export const BaseLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className={s.layoutContainer}>
      <Header />
      <Sidebar />
      {children}
    </div>
  );
};
