// components/Tab.stories.tsx
import { Tab } from '@/shared/ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Tab> = {
  title: 'Components/Tab',
  component: Tab,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} as Meta<typeof Tab>;

export default meta;

type Story = StoryObj<typeof Tab>;

// Basic Tab Example
export const TabDefault: Story = {
  args: {
    items: [
      {
        label: 'Profile',
        value: 'Profile',
        children: <div>Profile</div>,
      },
      {
        label: 'Setings',
        value: 'Setings',
        children: <div>Setings</div>,
      },
      {
        label: 'Post',
        value: 'Post',
        children: <div>Post</div>,
      },
    ],
  },
};

export const TabDisable: Story = {
  args: {
    items: [
      {
        label: 'Profile',
        value: 'Profile',
        children: <div>Profile</div>,
        disabled: true,
      },
      {
        label: 'Setings',
        value: 'Setings',
        children: <div>Setings</div>,
        disabled: true,
      },
      {
        label: 'Post',
        value: 'Post',
        children: <div>Post</div>,
        disabled: true,
      },
    ],
  },
};
