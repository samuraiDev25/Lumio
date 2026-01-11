import { ReactNode } from 'react';
import s from './Container.module.scss';
import { clsx } from 'clsx';

export const Container = ({ children }: { children: ReactNode }) => {
  return <div className={clsx(s.container)}>{children}</div>;
};
