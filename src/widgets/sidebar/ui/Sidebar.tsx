'use client';
import { usePathname } from 'next/navigation';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import s from './Sidebar.module.scss';
import { SidebarItemType, SidebarProps } from './types';
import {
  Heart,
  HeartOutline,
  Home,
  HomeOutline,
  LogOutOutline,
  MessageCircle,
  MessageCircleOutline,
  Person,
  PersonOutline,
  PlusCircle,
  PlusCircleOutline,
  SearchOutline,
  TrendingUpOutline,
} from '@/shared/ui/icons';
import { SidebarItem } from './SidebarItem';
import { LogOutButton } from '@/features/auth/ui/logout';
import { SIDEBAR_ROUTES } from '@/shared/lib/routes';

const mainItems: SidebarItemType[] = [
  {
    id: 'feed',
    label: 'Feed',
    iconOutline: HomeOutline,
    iconFilled: Home,
    href: `${SIDEBAR_ROUTES.FEED}`,
  },
  {
    id: 'create',
    label: 'Create',
    iconOutline: PlusCircleOutline,
    iconFilled: PlusCircle,
    href: `${SIDEBAR_ROUTES.CREATE}`,
  },
  {
    id: 'myProfile',
    label: 'My Profile',
    iconOutline: PersonOutline,
    iconFilled: Person,
    href: `${SIDEBAR_ROUTES.PROFILE}`,
  },
  {
    id: 'messenger',
    label: 'Messenger',
    iconOutline: MessageCircleOutline,
    iconFilled: MessageCircle,
    href: `${SIDEBAR_ROUTES.MESSENGER}`,
  },
  {
    id: 'search',
    label: 'Search',
    iconOutline: SearchOutline,
    href: `${SIDEBAR_ROUTES.SEARCH}`,
  },
  {
    id: 'statistics',
    label: 'Statistics',
    iconOutline: TrendingUpOutline,
    href: `${SIDEBAR_ROUTES.STATISTICS}`,
  },
  {
    id: 'favorites',
    label: 'Favorites',
    iconOutline: HeartOutline,
    iconFilled: Heart,
    href: `${SIDEBAR_ROUTES.FAVORITES}`,
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
  const pathname = usePathname();
  const activeItem =
    externalActiveItem ||
    mainItems.find((item) => pathname === item.href)?.id ||
    '';
  const isDisabled = variant === 'disabled';

  const handleItemClick = (itemId: string) => {
    if (isDisabled) return;

    const item = mainItems.find((i) => i.id === itemId);

    if (item?.href) {
      console.log(`Навигация на страницу: ${item.href}`);
    } else if (itemId === 'create') {
      console.log('Открыть модалку создания поста');
    }

    onItemClickAction?.(itemId);
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
