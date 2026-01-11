import { ComponentProps, FC, KeyboardEvent, ReactNode } from 'react';
import { useGetId } from './useGetId';
import s from './TextField.module.scss';
import { clsx } from 'clsx';
import { Search } from '@/shared/ui/icons';
import { Label } from '@/shared/ui';

export type TextFieldProps = {
  errorMessage?: string;
  iconEnd?: ReactNode;
  iconStart?: ReactNode;
  label?: ReactNode;
  onEndIconClick?: () => void;
  onEnter?: (e: KeyboardEvent<HTMLInputElement>) => void;
  search?: boolean;
  value?: string;
} & ComponentProps<'input'>;

export const TextField: FC<TextFieldProps> = ({
  errorMessage,
  iconEnd,
  iconStart,
  label,
  onEndIconClick,
  onEnter,
  search,
  className,
  id,
  onKeyDown,
  required,
  ref,
  disabled,
  ...rest
}) => {
  const showError = !disabled && !!errorMessage && errorMessage.length > 0;
  const textFieldId = useGetId(id);

  if (search) {
    iconStart = <Search />;
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (onEnter && e.key === 'Enter') {
      onEnter(e);
    }
    onKeyDown?.(e);
  };

  const classNames = {
    root: clsx(s.box, className),
    inputContainer: s.inputContainer,
    label: clsx(s.label, disabled && s.disabled),
    iconEnd: clsx(s.iconEnd, disabled && s.disabled),
    iconStart: clsx(s.iconStart, showError && s.error, disabled && s.disabled),
    input: clsx(s.input, showError && s.error),
    errorText: clsx(s.errorText),
  };

  const dataIconStart = iconStart ? 'start' : '';
  const dataIconEnd = iconEnd ? 'end' : '';
  const dataIcon = dataIconStart + dataIconEnd;

  return (
    <div className={classNames.root}>
      {label && (
        <Label
          className={classNames.label}
          htmlFor={textFieldId}
          label={label}
          required={required}
        />
      )}
      <div className={classNames.inputContainer}>
        {!!iconStart && (
          <span className={classNames.iconStart}>{iconStart}</span>
        )}
        <input
          className={classNames.input}
          data-icon={dataIcon}
          id={textFieldId}
          onKeyDown={handleKeyDown}
          ref={ref}
          required={required}
          type={'text'}
          disabled={disabled}
          {...rest}
        />
        {!!iconEnd && (
          <span className={classNames.iconEnd} onClick={onEndIconClick}>
            {iconEnd}
          </span>
        )}
      </div>
      {showError && (
        <span className={classNames.errorText}>{errorMessage}</span>
      )}
    </div>
  );
};
