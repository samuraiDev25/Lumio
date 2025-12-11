import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from '@/shared/ui';

const meta = {
  title: 'UI/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    totalPages: {
      control: { type: 'number', min: 1, max: 100 },
      description: 'Total number of pages',
    },
    initialPage: {
      control: { type: 'number', min: 1 },
      description: 'Initial active page',
    },
    initialPageSize: {
      control: {
        type: 'select',
        options: [10, 20, 30, 50, 100],
      },
      defaultValue: 100,
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WorkPagination: Story = {
  args: {
    totalPages: 55,
    initialPage: 7,
  },
  parameters: {
    docs: {
      description: {
        story: 'Работа пагинации',
      },
    },
  },
};
