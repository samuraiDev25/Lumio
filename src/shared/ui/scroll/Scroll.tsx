import React from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import styles from './Scroll.module.scss';

export interface ScrollProps {
  children: React.ReactNode;
  maxHeight?: string | number;
  type?: 'auto' | 'hover' | 'scroll' | 'always';
  showDivider?: boolean;
  className?: string;
}

export const Scroll: React.FC<ScrollProps> = ({
                                                children,
                                                maxHeight = '300px',
                                                type = 'hover',
                                                showDivider = false,
                                                className = '',
                                              }) => {
  return (
    <ScrollArea.Root
      className={`${styles.scrollRoot} ${className}`}
      type={type}
      style={{ maxHeight }}
    >
      <ScrollArea.Viewport className={styles.scrollViewport}>
        {children}
        {showDivider && <div className={styles.scrollDivider} />}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className={styles.scrollScrollbar} orientation="vertical">
        <ScrollArea.Thumb className={styles.scrollThumb} />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar className={styles.scrollScrollbar} orientation="horizontal">
        <ScrollArea.Thumb className={styles.scrollThumb} />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className={styles.scrollCorner} />
    </ScrollArea.Root>
  );
};

export default Scroll;
