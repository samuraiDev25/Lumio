'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { clsx } from 'clsx';
import styles from './Select.module.scss';
import ArrowIosDownOutline from '@/shared/ui/icons/ArrowIosDownOutline';
import ArrowIosUp from '@/shared/ui/icons/ArrowIosUp';

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot={'select'} {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot={'select-group'} {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot={'select-value'} {...props} />;
}

function SelectTrigger({
  className,
  size = 'default',
  children,
  isOpen,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'default';
  isOpen: boolean;
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot={'select-trigger'}
      data-size={size}
      data-state={isOpen}
      className={clsx(
        styles.trigger,
        size === 'default' && styles.triggerDefault,
        size === 'sm' && styles.triggerSm,
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        {isOpen ? <ArrowIosUp /> : <ArrowIosDownOutline />}
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot={'select-content'}
        className={clsx(
          styles.content,
          position === 'popper' && [
            props.side === 'bottom' && styles.popperBottom,
            props.side === 'left' && styles.popperLeft,
            props.side === 'right' && styles.popperRight,
            props.side === 'top' && styles.popperTop,
          ],
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={clsx(
            styles.viewport,
            position === 'popper' && styles.viewportPopper,
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot={'select-label'}
      className={clsx(styles.label, className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot={'select-item'}
      className={clsx(styles.item, className)}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot={'select-separator'}
      className={clsx(styles.separator, className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot={'select-scroll-up-button'}
      className={clsx(styles.scrollButton, className)}
      {...props}
    >
      <ArrowIosUp />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot={'select-scroll-down-button'}
      className={clsx(styles.scrollButton, className)}
      {...props}
    >
      <ArrowIosDownOutline />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
