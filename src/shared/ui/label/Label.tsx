import { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import * as LabelRadixUI from '@radix-ui/react-label';
import { clsx } from 'clsx';

import s from './Label.module.scss';

export type LabelProps = {
  label?: ReactNode;
  required?: boolean;
} & ComponentPropsWithoutRef<'label'>;

export const Label: FC<LabelProps> = ({
  children,
  className,
  label,
  required,
  ...rest
}) => {
  const classNames = {
    label: clsx(s.label, className),
    required: s.required,
  };

  return (
    <LabelRadixUI.Root {...rest}>
      {label && (
        <div className={classNames.label}>
          {label}
          {required && <span className={classNames.required}>*</span>}
        </div>
      )}
      {children}
    </LabelRadixUI.Root>
  );
};
