import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from '@/shared/ui/TextField';

const meta = {
  title: 'UI/TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: 'var(--color-dark-900)' },
        { name: 'light', value: 'var(--color-light-100)' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'search', 'password'],
    },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  args: {
    label: 'Email',
    placeholder: 'Epam@epam.com',
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: 'user@example.com' },
};

export const WithoutLabel: Story = {
  args: { label: undefined, placeholder: 'Введите текст...' },
};

export const HoverState: Story = {
  parameters: { pseudo: { hover: true } },
};

export const FocusState: Story = {
  parameters: { pseudo: { focus: true } },
};

export const ErrorState: Story = {
  args: { error: 'Обязательное поле' },
};

export const DisabledState: Story = {
  args: { disabled: true },
};

export const Search: Story = {
  args: {
    variant: 'search',
    label: 'Поиск',
    placeholder: 'Введите запрос...',
  },
};

export const Password: Story = {
  args: {
    variant: 'password',
    label: 'Пароль',
    placeholder: 'Введите пароль',
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Полная ширина',
    placeholder: 'Занимает всю доступную ширину',
    fullWidth: true,
  },
  parameters: { layout: 'fullscreen' },
};

export const InteractiveDemo: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '400px',
        padding: '20px',
        backgroundColor: '#0d0d0d',
        borderRadius: '8px',
      }}
    >
      <h3 style={{ margin: '0 0 8px 0', color: '#fff' }}>
        🧪 Все состояния TextField
      </h3>

      <TextField label="Default" placeholder="Epam@epam.com" />

      <TextField label="Hover (наведите)" placeholder="Наведите курсор" />

      <TextField label="Focus (кликните)" placeholder="Кликните для фокуса" />

      <TextField
        label="С ошибкой"
        placeholder="Epam@epam.com"
        error="Неправильный формат email"
      />

      <TextField
        label="Отключенное"
        placeholder="Недоступно для редактирования"
        disabled
      />

      <TextField
        label="Поиск"
        variant="search"
        placeholder="Введите поисковый запрос..."
      />

      <TextField
        label="Пароль"
        variant="password"
        placeholder="Введите пароль"
      />

      <div
        style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: 'rgba(141, 144, 148, 0.1)',
          borderRadius: '4px',
          fontSize: '14px',
          color: '#8d9094',
        }}
      >
        <strong>💡 Проверьте все состояния:</strong>
        <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
          <li>Наведите курсор на любое поле</li>
          <li>Кликните для фокуса</li>
          <li>Попробуйте ввести текст</li>
          <li>Нажмите на глаз для показа/скрытия пароля</li>
        </ul>
      </div>
    </div>
  ),
};

export const ErrorWithClear: Story = {
  render: () => {
    const ErrorDemo = () => {
      const [value, setValue] = useState('');
      const [error, setError] = useState('Email is required');

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '400px',
            padding: '20px',
            backgroundColor: '#0d0d0d',
            borderRadius: '8px',
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', color: '#fff' }}>
            Ошибка исчезает при вводе
          </h4>

          <TextField
            label="Email"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError('');
            }}
            error={error}
            placeholder="Введите email"
          />

          <div
            style={{
              padding: '12px',
              backgroundColor: 'rgba(141, 144, 148, 0.1)',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#8d9094',
            }}
          >
            <strong>📝 Как работает:</strong>
            <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px' }}>
              <li>Изначально показана ошибка валидации</li>
              <li>Начните вводить текст в поле</li>
              <li>Ошибка автоматически исчезнет</li>
              <li>Родительский компонент управляет состоянием ошибки</li>
            </ul>
          </div>
        </div>
      );
    };

    return <ErrorDemo />;
  },
};
