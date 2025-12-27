import { ComponentProps, FC, ReactNode } from 'react';

import s from './Card.module.scss';
import { clsx } from 'clsx';

export type CardProps = {
  children?: ReactNode;
} & ComponentProps<'div'>;

export const Card: FC<CardProps> = ({ children, className, ...rest }) => {
  const classNames = {
    box: clsx(s.box, className),
  };

  return (
    <div className={classNames.box} {...rest}>
      {children}
    </div>
  );
};
