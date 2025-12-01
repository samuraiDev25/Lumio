import type { Meta, StoryObj } from '@storybook/react';
import { ExampleButton } from './ExampleButton';

const meta: Meta<typeof ExampleButton> = {
  title: 'Example/ExampleButton',
  component: ExampleButton,
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked!' },
  },
};

export default meta;

type Story = StoryObj<typeof ExampleButton>;

export const Primary: Story = {
  args: {
    children: 'Primary',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    children: 'Delete',
    variant: 'danger',
  },
};

export const Large: Story = {
  args: {
    children: 'Large button',
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    children: 'I am disabled',
    disabled: true,
  },
};
