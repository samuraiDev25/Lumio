import React from 'react';
import * as Select from '@radix-ui/react-select';
import s from '../Select.module.scss';

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, value }, forwardedRef) => {
    return (
      <Select.Item className={s.item} value={value} ref={forwardedRef}>
        <Select.ItemText>{children}</Select.ItemText>
      </Select.Item>
    );
  },
);

export type SelectItemProps = {
  children: React.ReactNode;
  value: string;
};
SelectItem.displayName = 'SelectItem';
