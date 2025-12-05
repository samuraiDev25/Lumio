'use client';

import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { clsx } from 'clsx';
import s from './Typography.module.scss';

type TypographyColor = 'primary' | 'secondary' | 'accent' | 'danger';

export type TypographyProps<T extends ElementType> = {
  as?: T;
  children?: ReactNode;
  className?: string;
  isLink?: boolean;
  color?: TypographyColor;
  variant?:
    | 'large'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'regular_text_16'
    | 'bold_text_16'
    | 'regular_text_14'
    | 'medium_text_14'
    | 'bold_text_14'
    | 'small_text'
    | 'semi_bold_small_text';
};

export function Typography<K extends ElementType = 'p'>({
  as,
  className,
  color = 'primary',
  isLink,
  variant = 'regular_text_16',
  ...restProps
}: Omit<ComponentPropsWithoutRef<K>, keyof TypographyProps<K>> &
  TypographyProps<K>) {
  const classNames = clsx(
    s.typography,
    s[variant],
    s[color],
    isLink && s.link,
    className,
  );
  const Component = as || 'p';

  return <Component className={classNames} {...restProps} />;
}
