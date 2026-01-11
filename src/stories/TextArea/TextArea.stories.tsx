import type { Meta, StoryObj } from '@storybook/react';
import { TextArea, TextAreaProps } from '@/shared/ui/textArea/TextArea';

// Расширяем стандартные пропсы TextArea для Storybook
interface TextAreaStoryProps extends TextAreaProps {
  forceHover?: boolean;
  forceFocus?: boolean;
  forceActive?: boolean;
}

const meta: Meta<TextAreaStoryProps> = {
  title: 'Components/TextArea',
  component: TextArea as React.ComponentType<TextAreaStoryProps>,
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
    value: {
      control: 'text',
      description: 'Текущее значение текстового поля',
    },
    placeholder: {
      control: 'text',
      description: 'Текст-подсказка при пустом поле',
    },
    label: {
      control: 'text',
      description: 'Лейбл над полем ввода',
    },
    error: {
      control: 'boolean',
      description: 'Включение состояния ошибки',
    },
    errorMessage: {
      control: 'text',
      description: 'Сообщение об ошибке',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключенное состояние',
    },
    readOnly: {
      control: 'boolean',
      description: 'Режим только для чтения',
    },
    rows: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Количество строк',
    },
    maxLength: {
      control: { type: 'number', min: 1 },
      description: 'Максимальная длина',
    },
    forceHover: {
      control: 'boolean',
      description: 'Принудительное состояние hover',
    },
    forceFocus: {
      control: 'boolean',
      description: 'Принудительное состояние focus',
    },
    forceActive: {
      control: 'boolean',
      description: 'Принудительное состояние active',
    },
    onChange: {
      action: 'changed',
      description: 'Колбек при изменении значения',
    },
    onFocus: {
      action: 'focused',
      description: 'Колбек при получении фокуса',
    },
    onBlur: {
      action: 'blurred',
      description: 'Колбек при потере фокуса',
    },
  },
} satisfies Meta<TextAreaStoryProps>;

export default meta;
type Story = StoryObj<TextAreaStoryProps>;

// Все 6 основных состояний
export const DefaultState: Story = {
  name: 'Default',
  args: {
    label: 'Text-area',
    placeholder: 'Text-area',
  },
};

export const ActiveState: Story = {
  name: 'Active',
  args: {
    label: 'Text-area',
    value: 'Text-area',
    forceActive: true,
  },
};

export const ErrorState: Story = {
  name: 'Error',
  args: {
    label: 'Text-area',
    placeholder: 'Text-area',
    error: true,
    errorMessage: 'Error text',
  },
};

export const HoverState: Story = {
  name: 'Hover',
  args: {
    label: 'Text-area',
    placeholder: 'Text-area',
    forceHover: true,
  },
};

export const FocusState: Story = {
  name: 'Focus',
  args: {
    label: 'Text-area',
    value: 'Text-area',
    forceFocus: true,
    forceActive: true,
  },
};

export const DisabledState: Story = {
  name: 'Disabled',
  args: {
    label: 'Text-area',
    value: 'Text-area',
    disabled: true,
  },
};
