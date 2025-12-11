'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import clsx from 'clsx';
import s from './Button.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      asChild = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    const buttonClasses = clsx(
      s.button,
      s[variant],
      s[size],
      fullWidth && s.fullWidth,
      className,
    );

    return (
      <Comp
        ref={ref}
        className={buttonClasses}
        disabled={disabled}
        aria-disabled={disabled}
        role={asChild ? undefined : 'button'}
        tabIndex={disabled ? -1 : 0}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

Button.displayName = 'Button';
