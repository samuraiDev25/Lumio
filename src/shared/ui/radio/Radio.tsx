import * as RadioGroup from '@radix-ui/react-radio-group';
import React from 'react';
import s from './Radio.module.scss';

export type RadioOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type RadioGroupRadixProps = {
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  options: RadioOption[];
  className?: string;
};

export const Radio = ({
  name,
  value,
  defaultValue,
  disabled,
  onChange,
  options,
  className = '',
}: RadioGroupRadixProps) => {
  return (
    <RadioGroup.Root
      name={name}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onChange}
      disabled={disabled}
      className={`${s.RadioGroupRoot} ${className}`}
    >
      {options.map((opt) => {
        const isDisabled = disabled || opt.disabled;

        return (
          <label
            key={opt.value}
            className={s.Label}
            data-disabled={isDisabled ? '' : undefined}
          >
            <RadioGroup.Item
              value={opt.value}
              disabled={isDisabled}
              className={s.RadioGroupItem}
            >
              <RadioGroup.Indicator className={s.RadioGroupIndicator} />
            </RadioGroup.Item>
            <span>{opt.label}</span>
          </label>
        );
      })}
    </RadioGroup.Root>
  );
};
