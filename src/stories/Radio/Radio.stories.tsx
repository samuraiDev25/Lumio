import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Radio, RadioOption } from '@/shared/ui/radio/Radio';

const meta = {
  title: 'UI/Radio',
  component: Radio,
  argTypes: {
    name: { control: 'text' },
    value: { control: 'text' },
    defaultValue: { control: 'text' },
    disabled: { control: 'boolean' },
    onChange: { action: 'changed' },
    options: { control: 'object' },
    className: { control: 'text' },
  },
} satisfies Meta<typeof Radio>;

export default meta;

type Story = StoryObj<typeof meta>;

// ===================== Стандартная история ====================
export const Default: Story = {
  args: {
    name: 'example',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ] as RadioOption[],
    defaultValue: 'option2',
    disabled: false,
  },
};

// ===================== С отключёнными опциями =====================
export const WithDisabledOptions: Story = {
  args: {
    name: 'disabledExample',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2', disabled: true },
      { value: 'option3', label: 'Option 3' },
    ] as RadioOption[],
    defaultValue: 'option1',
  },
};

// ===================== Полностью отключённая группа =====================
export const DisabledGroup: Story = {
  args: {
    name: 'disabledGroup',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ] as RadioOption[],
    disabled: true,
    defaultValue: 'option1',
  },
};

// ===================== Управляемый пример с useState =====================
const ControlledExample = ({
  value = 'option1',
  onChange = () => {},
  options = [],
}: {
  value?: string;
  onChange?: (v: string) => void;
  options?: RadioOption[];
}) => {
  const [selected, setSelected] = React.useState(value);

  return (
    <Radio
      name="controlled"
      value={selected}
      onChange={setSelected}
      options={options}
    />
  );
};

export const Controlled: Story = {
  args: {
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    value: 'option1',
  },
  render: (args) => <ControlledExample {...args} />,
};
