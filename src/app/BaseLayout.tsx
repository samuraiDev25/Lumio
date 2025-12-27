'use client';

import { PropsWithChildren } from 'react';
import s from '@/app/BaseLayout.module.scss';
import { Header } from '@/widgets/header/ui';
import { Providers } from '@/app/Providers';
import { Sidebar } from '@/widgets/sidebar';

export const BaseLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className={s.layoutContainer}>
      <Providers>
        <Header />
        <Sidebar />
        {children}
      </Providers>
    </div>
  );
};
