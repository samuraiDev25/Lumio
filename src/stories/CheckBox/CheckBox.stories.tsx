import { useState } from 'react';
import { Checkbox } from '@/shared/ui';
import { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'Чекбокс',
    checked: false,
  },
  render: function Render(args) {
    const [checked, setChecked] = useState(args.checked);

    return <Checkbox {...args} checked={checked} onChangeAction={setChecked} />;
  },
};

export const Checked: Story = {
  args: {
    label: 'Отмеченный чекбокс',
    checked: true,
  },
  render: function Render(args) {
    const [checked, setChecked] = useState(args.checked);

    return <Checkbox {...args} checked={checked} onChangeAction={setChecked} />;
  },
};

export const Disabled: Story = {
  args: {
    label: 'Отключенный чекбокс',
    checked: false,
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Отключенный отмеченный',
    checked: true,
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Чекбокс с ошибкой',
    checked: false,
    errorMessage: 'Обязательное поле',
  },
  render: function Render(args) {
    const [checked, setChecked] = useState(args.checked);

    return <Checkbox {...args} checked={checked} onChangeAction={setChecked} />;
  },
};

export const CheckboxGroup: Story = {
  render: function Render() {
    const [values, setValues] = useState({
      option1: false,
      option2: true,
      option3: false,
    });

    const handleChange = (key: string) => (checked: boolean) => {
      setValues((prev) => ({ ...prev, [key]: checked }));
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Checkbox
          checked={values.option1}
          label="Опция 1"
          onChangeAction={handleChange('option1')}
        />
        <Checkbox
          checked={values.option2}
          label="Опция 2"
          onChangeAction={handleChange('option2')}
        />
        <Checkbox
          checked={values.option3}
          disabled
          label="Опция 3 (disabled)"
          onChangeAction={handleChange('option3')}
        />
      </div>
    );
  },
};
