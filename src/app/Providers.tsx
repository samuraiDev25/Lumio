'use client';
import { PropsWithChildren } from 'react';
import { StoreProvider } from '@/app/StoreProvider';
import { ToastContainer } from 'react-toastify';

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <StoreProvider>
      {children}
      <ToastContainer position="bottom-right" autoClose={4000} />
    </StoreProvider>
  );
};
