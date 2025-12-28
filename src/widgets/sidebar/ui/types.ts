import React from 'react';

export type IconComponent = React.ComponentType<{
  className?: string;
  onClick?: () => void;
}>;

export type SidebarItemType = {
  id: string;
  label: string;
  iconOutline: IconComponent;
  iconFilled?: IconComponent;
  href?: string;
};

export type SidebarProps = {
  variant?: 'default' | 'disabled';
  activeItem?: string;
  onItemClickAction?: (itemId: string) => void;
  onLogoutAction?: () => void;
  className?: string;
  style?: React.CSSProperties;
};

export type SidebarItemProps = {
  item: SidebarItemType;
  isActive?: boolean;
  isDisabled?: boolean;
  isLogout?: boolean;
  onClickAction?: () => void;
  className?: string;
};
