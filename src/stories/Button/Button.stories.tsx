import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/shared/ui';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: 'var(--color-dark-900)' }],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'link'] as const,
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const AllVariants: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="link">Text Button</Button>
    </div>
  ),
};

export const PrimaryStates: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Default
        </div>
        <Button variant="primary">Primary Button</Button>
      </div>

      <div>
        <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Disabled
        </div>
        <Button variant="primary" disabled>
          Primary Disabled
        </Button>
      </div>
    </div>
  ),
};

export const SecondaryStates: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Default
        </div>
        <Button variant="secondary">Secondary Button</Button>
      </div>

      <div>
        <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Disabled
        </div>
        <Button variant="secondary" disabled>
          Secondary Disabled
        </Button>
      </div>
    </div>
  ),
};

export const OutlineStates: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Default
        </div>
        <Button variant="outline">Outline Button</Button>
      </div>

      <div>
        <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Disabled
        </div>
        <Button variant="outline" disabled>
          Outline Disabled
        </Button>
      </div>
    </div>
  ),
};

export const TextButtonStates: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Default
        </div>
        <Button variant="link">Text Button</Button>
      </div>

      <div>
        <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Disabled
        </div>
        <Button variant="link" disabled>
          Text Button Disabled
        </Button>
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    children: 'Edit me',
    variant: 'primary',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Используй панель Controls справа чтобы менять свойства кнопки',
      },
    },
  },
};
