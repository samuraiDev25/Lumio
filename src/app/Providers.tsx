'use client';

import React, { PropsWithChildren } from 'react';
import { PopUp } from '@/shared/ui';
import { StoreProvider } from '@/app/StoreProvider';
import { AppLoader } from '@/shared/composed/loader';

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <>
      <StoreProvider>
        {children}
        <PopUp />
        <AppLoader />
      </StoreProvider>
    </>
  );
};
