'use client';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { SidebarItemProps } from '../types';
import s from '../Sidebar.module.scss';
import React from 'react';

export const SidebarItem = ({
  item: { iconOutline: IconOutline, iconFilled: IconFilled, label, href },
  isActive = false,
  isDisabled = false,
  isLogout = false,
  onClickAction,
  className = '',
}: SidebarItemProps) => {
  const IconComponent = isActive && IconFilled ? IconFilled : IconOutline;

  const handleClick = (e: React.MouseEvent) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    if (href === '#') e.preventDefault();
    onClickAction?.();
  };

  const commonProps = {
    className: `${s['nav-link']} ${isActive ? s.active : ''} ${isDisabled ? s.disabled : ''} ${isLogout ? s.logout : ''} ${className}`,
    'aria-disabled': isDisabled,
    tabIndex: isDisabled ? -1 : 0,
  };

  const content = (
    <>
      <div className={s['icon-container']}>
        {' '}
        <IconComponent className={s.icon} />
      </div>
      <span className={s['text-container']}>{label}</span>
    </>
  );

  return (
    <NavigationMenu.Item>
      {href ? (
        <NavigationMenu.Link asChild>
          <a
            href={isDisabled ? '#' : href}
            {...commonProps}
            onClick={handleClick}
          >
            {content}
          </a>
        </NavigationMenu.Link>
      ) : (
        <NavigationMenu.Link asChild>
          <button
            type="button"
            disabled={isDisabled}
            {...commonProps}
            onClick={handleClick}
          >
            {content}
          </button>
        </NavigationMenu.Link>
      )}
    </NavigationMenu.Item>
  );
};
