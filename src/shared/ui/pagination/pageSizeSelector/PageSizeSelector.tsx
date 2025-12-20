'use client';

import s from '../Pagination.module.scss';
import { ArrowIosDownOutline, ArrowIosUp } from '@/shared/ui/icons';
import * as Select from '@radix-ui/react-select';
import { useState } from 'react';

type Props = {
  pageSize: number;
  pageSizeOptions: number[];
  handlePageSizeChangeAction: (size: number) => void;
};

export const PageSizeSelector = ({
  pageSize,
  pageSizeOptions,
  handlePageSizeChangeAction,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <label className={s.label}>
      Show
      <Select.Root
        value={String(pageSize)}
        onValueChange={(value) => handlePageSizeChangeAction(Number(value))}
        onOpenChange={setIsOpen}
      >
        <Select.Trigger className={s.trigger}>
          <Select.Value className={s.value} />
          <Select.Icon>
            {isOpen ? <ArrowIosUp /> : <ArrowIosDownOutline />}
          </Select.Icon>
        </Select.Trigger>

        <Select.Content className={s.content} position="popper" sideOffset={0}>
          <Select.ScrollUpButton className={s.scrollButton}>
            <ArrowIosUp />
          </Select.ScrollUpButton>

          <Select.Viewport className={s.viewport}>
            {pageSizeOptions.map((size) => (
              <Select.Item key={size} value={String(size)} className={s.item}>
                <Select.ItemText>{size}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Root>
      on page
    </label>
  );
};
