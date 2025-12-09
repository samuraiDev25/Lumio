import type { Meta, StoryObj } from '@storybook/react';
import Scroll, { ScrollProps } from '@/shared/ui/scroll/Scroll';

const meta: Meta<ScrollProps> = {
  title: 'UI-KIT/scroll',
  component: Scroll,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0D0D0D' },
        { name: 'light', value: '#FFFFFF' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    maxHeight: {
      control: 'text',
      description: 'Максимальная высота контейнера',
    },
    type: {
      control: 'select',
      options: ['auto', 'hover', 'scroll', 'always'],
      description: 'Тип отображения скроллбара',
    },
    showDivider: {
      control: 'boolean',
      description: 'Показать разделительную линию',
    },
    children: {
      control: 'text',
      description: 'Контент для скролла',
    },
  },
} satisfies Meta<ScrollProps>;

export default meta;
type Story = StoryObj<ScrollProps>;

// Пример контента для скролла
const LongContent = () => (
  <div style={{ padding: '20px', color: '#FFFFFF' }}>
    <h3>Длинный контент для скролла</h3>
    {Array.from({ length: 20 }).map((_, i) => (
      <p key={i}>Пункт контента номер {i + 1}</p>
    ))}
  </div>
);

export const Default: Story = {
  name: 'Default',
  args: {
    maxHeight: '300px',
    type: 'hover',
    showDivider: false,
    children: <LongContent />,
  },
};

export const WithDivider: Story = {
  name: 'With Divider',
  args: {
    maxHeight: '300px',
    type: 'hover',
    showDivider: true,
    children: <LongContent />,
  },
};

export const AlwaysVisible: Story = {
  name: 'Always Visible',
  args: {
    maxHeight: '300px',
    type: 'always',
    showDivider: false,
    children: <LongContent />,
  },
};

export const HorizontalScroll: Story = {
  name: 'Horizontal Scroll',
  render: () => (
    <div style={{ width: '500px' }}>
      <Scroll maxHeight="200px" type="hover">
        <div style={{
          display: 'flex',
          gap: '20px',
          padding: '20px',
          minWidth: '1000px',
          color: '#FFFFFF'
        }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{
              width: '150px',
              height: '100px',
              backgroundColor: '#333333',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              Блок {i + 1}
            </div>
          ))}
        </div>
      </Scroll>
    </div>
  ),
};
