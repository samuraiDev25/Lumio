'use client';

import * as React from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import s from './Select.module.scss';
import { useState } from 'react';
import { SelectItem } from '@/shared/ui/select/selectItem/SelectItem';

export const SelectBox = (props: CustomSelectProps) => {
  const {
    label = null,
    placeholder = 'Select-box',
    disabled = false,
    error = null,
    options = [],
  } = props;

  const [value, setValue] = useState('');
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className={s.selectWrapper}>
      {label && <label className={s.label}>{label}</label>}
      <Select.Root
        value={value}
        onValueChange={setValue}
        disabled={disabled}
        open={open}
        onOpenChange={setOpen}
      >
        <Select.Trigger
          className={`${s.selectTrigger} ${disabled ? s.triggerDisabled : ''} ${error ? s.triggerError : ''}`}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            {open ? (
              <ChevronUpIcon className={s.icon} />
            ) : (
              <ChevronDownIcon className={s.icon} />
            )}
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className={s.content}
            position="popper"
            sideOffset={0}
          >
            <Select.Viewport className={s.viewport}>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

export type CustomSelectProps = {
  label?: string | null;
  placeholder?: string;
  disabled?: boolean;
  error?: string | null;
  options: SelectOption[];
};
export type SelectOption = {
  value: string;
  label: string;
};
