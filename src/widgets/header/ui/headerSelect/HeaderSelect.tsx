'use client';

import s from './HeaderSelect.module.scss';
import { SelectBox, SelectItem } from '@/shared/ui';
import { FlagRussia, FlagUnitedKingdom } from '@/shared/ui/icons';

export function HeaderSelect() {
  return (
    <SelectBox
      placeholder="English"
      options={[
        {
          value: 'en',
          label: 'English',
        },
        {
          value: 'ru',
          label: 'Russian',
        },
      ]}
    >
      <SelectItem value={'en'}>
        <FlagUnitedKingdom className={s.icon} />
        <span className={s.text}>English</span>
      </SelectItem>
      <SelectItem value={'ru'}>
        <FlagRussia className={s.icon} />
        <span className={s.text}>Russian</span>
      </SelectItem>
    </SelectBox>
  );
}
