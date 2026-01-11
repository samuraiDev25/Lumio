'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import clsx from 'clsx';
import s from './Button.module.scss';
import { ComponentPropsWithRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  asChild?: boolean;
} & ComponentPropsWithRef<'button'>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      asChild = false,
      children,
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
      <Comp ref={ref} className={buttonClasses} {...props}>
        {children}
      </Comp>
    );
  },
);

Button.displayName = 'Button';
