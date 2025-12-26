import { Sidebar } from '@/widgets/sidebar/ui/Sidebar';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Sidebar> = {
  title: 'Widgets/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    activeItem: 'feed',
    onItemClickAction: (itemId) => console.log('Clicked:', itemId),
    onLogoutAction: () => console.log('Logout'),
  },
};

export const ActiveCreate: Story = {
  name: 'Active - Create',
  args: {
    activeItem: 'create',
    onItemClickAction: (itemId) => console.log('Clicked:', itemId),
    onLogoutAction: () => console.log('Logout'),
  },
};

export const ActiveMyProfile: Story = {
  name: 'Active - My Profile',
  args: {
    activeItem: 'myProfile',
    onItemClickAction: (itemId) => console.log('Clicked:', itemId),
    onLogoutAction: () => console.log('Logout'),
  },
};

export const ActiveMessenger: Story = {
  name: 'Active - Messenger',
  args: {
    activeItem: 'messenger',
    onItemClickAction: (itemId) => console.log('Clicked:', itemId),
    onLogoutAction: () => console.log('Logout'),
  },
};

export const ActiveSearch: Story = {
  name: 'Active - Search',
  args: {
    activeItem: 'search',
    onItemClickAction: (itemId) => console.log('Clicked:', itemId),
    onLogoutAction: () => console.log('Logout'),
  },
};

export const ActiveStatistics: Story = {
  name: 'Active - Statistics',
  args: {
    activeItem: 'statistics',
    onItemClickAction: (itemId) => console.log('Clicked:', itemId),
    onLogoutAction: () => console.log('Logout'),
  },
};

export const ActiveFavorites: Story = {
  name: 'Active - Favorites',
  args: {
    activeItem: 'favorites',
    onItemClickAction: (itemId) => console.log('Clicked:', itemId),
    onLogoutAction: () => console.log('Logout'),
  },
};

export const ActiveLogout: Story = {
  name: 'Active - Logout',
  args: {
    activeItem: 'logout',
    onItemClickAction: (itemId) => console.log('Clicked:', itemId),
    onLogoutAction: () => console.log('Logout'),
  },
};

export const Disabled: Story = {
  args: {
    variant: 'disabled',
    activeItem: 'feed',
    onItemClickAction: undefined,
    onLogoutAction: undefined,
  },
};
