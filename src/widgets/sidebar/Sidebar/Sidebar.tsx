import s from './Sidebar.module.scss';
import {
  BookmarkOutline,
  HomeOutline,
  LogOutOutline,
  MessageCircleOutline,
  PersonOutline,
  PlusSquareOutline,
  SearchOutline,
  TrendingUpOutline,
} from '@/shared/ui/icons';
import { SidebarItem } from '@/widgets/sidebar';
import { APP_ROUTES, SIDEBAR_ROUTES } from '@/shared/lib/routes';
import { Dialog } from '@/shared/ui';
import { useState } from 'react';
import { useLogout } from '@/features/auth/lib/hooks/useLogout';

export const Sidebar = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { onLogout, userData } = useLogout();

  const mainLinks = [
    { title: 'Feed', href: `${SIDEBAR_ROUTES.FEED}`, icon: <HomeOutline /> },
    {
      title: 'Create',
      href: `${SIDEBAR_ROUTES.CREATE}`,
      icon: <PlusSquareOutline />,
    },
    {
      title: 'My Profile',
      href: `${APP_ROUTES.PROFILE}`,
      icon: <PersonOutline />,
    },
    {
      title: 'Messenger',
      href: `${SIDEBAR_ROUTES.MESSENGER}`,
      icon: <MessageCircleOutline />,
    },
    {
      title: 'Search',
      href: `${SIDEBAR_ROUTES.SEARCH}`,
      icon: <SearchOutline />,
    },
  ];

  const extraLinks = [
    {
      title: 'Statistics',
      href: `${SIDEBAR_ROUTES.STATISTICS}`,
      icon: <TrendingUpOutline />,
    },
    {
      title: 'Favorites',
      href: `${SIDEBAR_ROUTES.FAVORITE}`,
      icon: <BookmarkOutline />,
    },
  ];

  return (
    <nav className={s.sidebar} aria-label="Main navigation">
      <div>
        <div className={s.main}>
          {mainLinks.map(({ title, href, icon }) => {
            return (
              <SidebarItem
                key={href}
                title={title}
                href={href}
                startDecoration={icon}
              />
            );
          })}
        </div>

        <div className={s.list}>
          {extraLinks.map((link) => {
            return (
              <SidebarItem
                key={link.href}
                title={link.title}
                href={link.href}
                startDecoration={link.icon}
              />
            );
          })}
        </div>
      </div>

      <div className={s.logout}>
        <SidebarItem
          className={s.logoutBtn}
          title={'Logout'}
          onclick={() => setShowModal(true)}
          startDecoration={<LogOutOutline aria-label="Log out" />}
        />
      </div>
      <Dialog
        open={showModal}
        title={'Log out'}
        size={'sm'}
        confirmButtonText={'Yes'}
        cancelButtonText={'No'}
        buttonsMarginTop={'18px'}
        onConfirmButtonClick={onLogout}
        onClose={() => setShowModal(false)}
      >
        {`Do you really want to log out of your account ${userData?.email}?`}
      </Dialog>
    </nav>
  );
};

export default Sidebar;
