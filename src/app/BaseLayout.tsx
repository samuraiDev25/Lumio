'use client';

import { PropsWithChildren } from 'react';
import s from '@/app/BaseLayout.module.scss';
import { Header } from '@/widgets/header/ui';

export const BaseLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className={s.layoutContainer}>
      <Header />
      {children}
    </div>
  );
};
