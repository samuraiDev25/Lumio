// components/DynamicTabs.tsx
'use client';

import s from './Tab.module.scss';
import * as Tabs from '@radix-ui/react-tabs';

interface Props {
  items: {
    label: string;
    value: string;
    children: React.ReactNode;
  }[];
  defaultTab?: string;
}

export default function Tab({ items, defaultTab }: Props) {
  const defaultValue = defaultTab || items[0]?.value;

  return (
    <Tabs.Root
      className={s.root}
      defaultValue={defaultValue}
      activationMode="manual"
    >
      <Tabs.List className={s.list}>
        {items.map((tab) => (
          <Tabs.Trigger className={s.trigger} key={tab.value} value={tab.value}>
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {items.map((tab) => (
        <Tabs.Content key={tab.value} value={tab.value}>
          {tab.children}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
