import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from '@/shared/ui';

const meta: Meta<typeof DatePicker> = {
  title: 'UI/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const MultipleDate: Story = {
  args: {
    mode: 'multiple',
    disabled: false,
  },
};
export const RangeDate: Story = {
  args: {
    mode: 'range',
    disabled: false,
  },
};
