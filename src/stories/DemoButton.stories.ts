import type { Meta, StoryObj } from '@storybook/react';
import { DemoButton } from './DemoButton';

const meta: Meta<typeof DemoButton> = {
  title: 'Example/DemoButton',
  component: DemoButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DemoButton>;

export const Primary: Story = {
  args: {
    children: 'Click me',
  },
};
