import React from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import './Scroll.scss';

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
      className={`scroll-root ${className}`}
      type={type}
      style={{ maxHeight }}
    >
      <ScrollArea.Viewport className="scroll-viewport">
        {children}
        {showDivider && <div className="scroll-divider" />}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="scroll-scrollbar" orientation="vertical">
        <ScrollArea.Thumb className="scroll-thumb" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar className="scroll-scrollbar" orientation="horizontal">
        <ScrollArea.Thumb className="scroll-thumb" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className="scroll-corner" />
    </ScrollArea.Root>
  );
};

export default Scroll;
