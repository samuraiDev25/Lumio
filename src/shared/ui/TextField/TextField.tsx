'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/shared/lib/utils';
import styles from './TextField.module.scss';
import { EyeOffOutline, EyeOutline, SearchOutline } from '@/shared/ui/icons';

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: 'default' | 'search' | 'password';
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      label,
      error,
      fullWidth = false,
      startIcon,
      endIcon,
      variant = 'default',
      type: initialType = 'text',
      id,
      disabled,
      placeholder,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const [showPassword, setShowPassword] = React.useState(false);
    const type =
      variant === 'password'
        ? showPassword
          ? 'text'
          : 'password'
        : initialType;

    // Иконка поиска
    const searchIcon = variant === 'search' ? <SearchOutline /> : null;

    // Иконка пароля
    const passwordIcon =
      variant === 'password' ? (
        <button
          type="button"
          className={styles['password-toggle']}
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
        >
          {showPassword ? <EyeOutline /> : <EyeOffOutline />}
        </button>
      ) : null;

    const finalStartIcon = startIcon || searchIcon;
    const finalEndIcon = endIcon || passwordIcon;

    return (
      <div
        className={cn(
          styles.wrapper,
          fullWidth && styles['full-width'],
          className,
        )}
      >
        {label && (
          <LabelPrimitive.Root
            htmlFor={inputId}
            className={cn(styles.label, disabled && styles['label-disabled'])}
          >
            {label}
          </LabelPrimitive.Root>
        )}

        <div className={styles['input-container']}>
          {finalStartIcon && (
            <div className={cn(styles.icon, styles['start-icon'])}>
              {finalStartIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              styles.input,
              error && styles['input-error'],
              finalStartIcon && styles['has-start-icon'],
              finalEndIcon && styles['has-end-icon'],
              disabled && styles['input-disabled'],
            )}
            type={type}
            disabled={disabled}
            placeholder={placeholder}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            aria-disabled={disabled}
            {...props}
          />

          {finalEndIcon && (
            <div className={cn(styles.icon, styles['end-icon'])}>
              {finalEndIcon}
            </div>
          )}
        </div>

        {error && (
          <LabelPrimitive.Root
            htmlFor={inputId}
            className={styles['error-text']}
            id={`${inputId}-error`}
            aria-live="polite"
          >
            {error}
          </LabelPrimitive.Root>
        )}
      </div>
    );
  },
);

TextField.displayName = 'TextField';
