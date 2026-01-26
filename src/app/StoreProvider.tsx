'use client';

import { useMemo, useRef } from 'react';
import { Provider } from 'react-redux';
import { createStore } from '@/app/store';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const store = useMemo(() => createStore(), []);

  return <Provider store={store}>{children}</Provider>;
}
