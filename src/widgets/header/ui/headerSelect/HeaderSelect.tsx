'use client';

import s from './HeaderSelect.module.scss';
import { FlagRussia, FlagUnitedKingdom } from '@/shared/ui/icons';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/shared/ui/select/Select';
import { useState } from 'react';
import clsx from 'clsx';

export function HeaderSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const openHandler = (open: boolean) => {
    setIsOpen(open);
  };
  const changeValueHandler = (value: string) => {
    alert(`выбранное значение: ${value}`);
  };

  return (
    <Select
      onOpenChange={openHandler}
      onValueChange={changeValueHandler}
      defaultValue={'en'}
    >
      <SelectTrigger
        isOpen={isOpen}
        className={clsx(s.trigger, isOpen && s.open)}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        position={'popper'}
        className={clsx(s.content, isOpen && s.open)}
      >
        <SelectGroup>
          <SelectItem className={s.item} value={'en'}>
            <FlagUnitedKingdom className={s.icon} />
            <span className={s.text}>English</span>
          </SelectItem>
          <SelectItem value={'ru'}>
            <FlagRussia className={s.icon} />
            <span className={s.text}>Russian</span>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
