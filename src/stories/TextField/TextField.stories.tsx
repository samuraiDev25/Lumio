import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from '@/shared/ui';

const meta: Meta<typeof TextField> = {
  title: 'TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    errorMessage: { control: 'text' },
    value: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    search: { control: 'boolean' },
    iconStart: { control: false },
    iconEnd: { control: false },
    onEndIconClick: { action: 'clicked' },
    onEnter: { action: 'enter pressed' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Введите текст...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Имя пользователя',
    placeholder: 'Введите ваше имя...',
  },
};

export const Required: Story = {
  args: {
    label: 'Пароль',
    placeholder: 'Введите пароль...',
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Заблокированное поле',
    placeholder: 'Недоступно',
    disabled: true,
  },
};

export const WithValue: Story = {
  args: {
    label: 'Предзаполненное поле',
    value: 'example@mail.com',
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Поле с ошибкой',
    placeholder: 'Введите корректный email...',
    errorMessage: 'Некорректный формат email',
  },
};

export const SearchField: Story = {
  args: {
    label: 'Поиск',
    placeholder: 'Поиск по сайту...',
    search: true,
  },
};

export const WithEndIcon: Story = {
  args: {
    label: 'Поле с иконкой',
    placeholder: 'Кликните на иконку...',
    iconEnd: <span>✕</span>,
  },
};

export const WithIcons: Story = {
  args: {
    label: 'С иконками',
    placeholder: 'Текст с иконками...',
    iconStart: <span>📧</span>,
    iconEnd: <span>👁️</span>,
  },
};

export const LongText: Story = {
  args: {
    placeholder: 'Очень длинный placeholder текст для проверки обрезания...',
    value:
      'Длинный текст в поле ввода который должен корректно отображаться...',
  },
};

export const WithCustomIconAndError: Story = {
  args: {
    label: 'С кастомной иконкой и ошибкой',
    placeholder: 'Проверьте поле...',
    iconStart: <span>⚠️</span>,
    errorMessage: 'Это поле обязательно для заполнения',
  },
};
