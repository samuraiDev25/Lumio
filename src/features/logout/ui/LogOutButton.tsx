'use client';

import React from 'react';
import { Button } from '@/shared/ui';
import { LogOutOutline } from '@/shared/ui/icons';
import clsx from 'clsx';
import s from './LogOutButton.module.scss';

export type LogOutButtonProps = {
  /** Колбэк при нажатии на кнопку выхода */
  onLogout?: () => void;
  /** Вариант кнопки */
  variant?: 'primary' | 'secondary' | 'outline' | 'link';
  /** Размер кнопки */
  size?: 'sm' | 'md' | 'lg';
  /** Показать иконку */
  showIcon?: boolean;
  /** Текст кнопки */
  children?: React.ReactNode;
  /** Дополнительный className */
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick'>;

export const LogOutButton: React.FC<LogOutButtonProps> = ({
  onLogout,
  variant = 'outline',
  size = 'md',
  showIcon = false,
  children = 'Log out',
  className,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onLogout?.();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={clsx(s.logOutButton, className)}
      {...props}
    >
      {showIcon && <LogOutOutline className={s.icon} />}
      {children}
    </Button>
  );
};

