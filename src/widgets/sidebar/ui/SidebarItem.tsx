'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { SidebarItemProps } from './types';
import s from './Sidebar.module.scss';
import { clsx } from 'clsx';

export const SidebarItem = memo(
  ({
    item: { iconOutline: IconOutline, iconFilled: IconFilled, label, href, id },
    isActive = false,
    isDisabled = false,
    isLogout = false,
    onClickAction,
    className = '',
  }: SidebarItemProps) => {
    const IconComponent = isActive && IconFilled ? IconFilled : IconOutline;

    const isAction = id === 'create' || id === 'search';

    const classNames = clsx(
      s['nav-link'],
      isActive && s.active,
      isDisabled && s.disabled,
      isLogout && s.logout,
      className,
    );

    const content = (
      <>
        <div className={s['icon-container']}>
          <IconComponent className={s.icon} />
        </div>
        <span className={s['text-container']}>{label}</span>
      </>
    );

    return (
      <li className={s['nav-item']}>
        {href && !isAction ? (
          <Link
            href={isDisabled ? '#' : href}
            className={classNames}
            onClick={() => onClickAction?.()}
          >
            {content}
          </Link>
        ) : (
          <button
            type="button"
            disabled={isDisabled}
            className={classNames}
            onClick={(e) => {
              e.preventDefault();
              onClickAction?.();
            }}
          >
            {content}
          </button>
        )}
      </li>
    );
  },
);

SidebarItem.displayName = 'SidebarItem';
