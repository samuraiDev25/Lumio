'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/shared/lib/utils';
import styles from './TextField.module.scss';

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

    const searchIcon =
      variant === 'search' ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M11.5 11.5L14 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      ) : null;

    const passwordIcon =
      variant === 'password' ? (
        <button
          type="button"
          className={styles['password-toggle']}
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
        >
          {showPassword ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M1 8C1 8 3 3 8 3C13 3 15 8 15 8C15 8 13 13 8 13C3 13 1 8 1 8Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6.5 3.5L9.5 12.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M1.5 8H3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M12.5 8H14.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M5 5.5L3 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M11 10.5L13 12.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
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
