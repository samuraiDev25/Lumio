import type { Meta, StoryObj } from '@storybook/react';
import { SelectBox } from '@/shared/ui';

const meta: Meta<typeof SelectBox> = {
  title: 'UI/SelectBox',
  component: SelectBox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SelectBox>;

export const SelectDefault: Story = {
  args: {
    label: 'Select-box',
    placeholder: 'Select',
    options: [
      { value: 'opt1', label: 'Select-box1' },
      { value: 'opt2', label: 'Select-box2' },
      { value: 'opt3', label: 'Select-box3' },
    ],
  },
};
export const SelectDisabled: Story = {
  args: {
    label: 'Select-box',
    placeholder: 'Select',
    disabled: true,
    options: [
      { value: 'opt1', label: 'Select-box1' },
      { value: 'opt2', label: 'Select-box2' },
      { value: 'opt3', label: 'Select-box3' },
    ],
  },
};
