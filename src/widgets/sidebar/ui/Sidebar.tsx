'use client';

import { useState } from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import s from './Sidebar.module.scss';
import { SidebarProps, SidebarItemType } from './types';
import {
  HomeOutline,
  Home,
  PlusCircleOutline,
  PlusCircle,
  PersonOutline,
  Person,
  MessageCircleOutline,
  MessageCircle,
  SearchOutline,
  TrendingUpOutline,
  HeartOutline,
  Heart,
  LogOutOutline,
} from '@/shared/ui/icons';
import { SidebarItem } from './SidebarItem';
import { LogOutButton } from '@/features/auth/ui/logout';

const mainItems: SidebarItemType[] = [
  {
    id: 'feed',
    label: 'Feed',
    iconOutline: HomeOutline,
    iconFilled: Home,
    href: '/',
  },
  {
    id: 'create',
    label: 'Create',
    iconOutline: PlusCircleOutline,
    iconFilled: PlusCircle,
  },
  {
    id: 'myProfile',
    label: 'My Profile',
    iconOutline: PersonOutline,
    iconFilled: Person,
    href: '/profile',
  },
  {
    id: 'messenger',
    label: 'Messenger',
    iconOutline: MessageCircleOutline,
    iconFilled: MessageCircle,
    href: '/messenger',
  },
  {
    id: 'search',
    label: 'Search',
    iconOutline: SearchOutline,
    href: '/search',
  },
  {
    id: 'statistics',
    label: 'Statistics',
    iconOutline: TrendingUpOutline,
    href: '/statistics',
  },
  {
    id: 'favorites',
    label: 'Favorites',
    iconOutline: HeartOutline,
    iconFilled: Heart,
    href: '/favorites',
  },
];

export const Sidebar = ({
  variant = 'default',
  activeItem: externalActiveItem,
  onItemClickAction,
  onLogoutAction,
  className = '',
  style,
}: SidebarProps) => {
  const [internalActiveItem, setInternalActiveItem] = useState<string>('feed');
  const activeItem = externalActiveItem || internalActiveItem;
  const isDisabled = variant === 'disabled';

  const handleItemClick = (itemId: string) => {
    if (!isDisabled) {
      if (!externalActiveItem) {
        setInternalActiveItem(itemId);
      }

      const item = mainItems.find((i) => i.id === itemId);

      if (item?.href) {
        console.log(`Навигация на страницу: ${item.href}`);
      } else if (itemId === 'create') {
        console.log('Открыть модалку создания поста');
      }

      onItemClickAction?.(itemId);
    }
  };

  const handleLogout = () => {
    if (!isDisabled) {
      if (!externalActiveItem) {
        setInternalActiveItem('logout');
      }

      onLogoutAction?.();
    }
  };

  return (
    <aside className={`${s.sidebar} ${s[variant]} ${className}`} style={style}>
      <NavigationMenu.Root orientation="vertical">
        <nav className={s['nav-container']}>
          <NavigationMenu.List className={s['nav-list']}>
            {mainItems.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                isDisabled={isDisabled}
                onClickAction={() => handleItemClick(item.id)}
                className={s[item.id === 'myProfile' ? 'my-profile' : item.id]}
              />
            ))}
          </NavigationMenu.List>

          {/* Log Out */}
          <div className={s['logout-section']}>
            <NavigationMenu.Item>
              <LogOutButton
                variant="link"
                onLogout={() => {
                  if (!isDisabled) {
                    if (!externalActiveItem) {
                      setInternalActiveItem('logout');
                    }
                    onLogoutAction?.();
                  }
                }}
                className={`${s['nav-link']} ${activeItem === 'logout' ? s.active : ''} ${isDisabled ? s.disabled : ''} ${s.logout}`}
              >
                <div className={s['icon-container']}>
                  <LogOutOutline className={s.icon} />
                </div>
                <span className={s['text-container']}>Log Out</span>
              </LogOutButton>
            </NavigationMenu.Item>
          </div>
        </nav>
      </NavigationMenu.Root>
    </aside>
  );
};
