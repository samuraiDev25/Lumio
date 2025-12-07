import React, { useState } from 'react';
import './TextArea.scss';

export interface TextAreaProps {
  value?: string;
  placeholder?: string;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  rows?: number;
  maxLength?: number;
  readOnly?: boolean;
  className?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
                                                    value = '',
                                                    placeholder = '',
                                                    label = '',
                                                    error = false,
                                                    errorMessage = '',
                                                    disabled = false,
                                                    onChange,
                                                    onFocus,
                                                    onBlur,
                                                    rows = 3,
                                                    maxLength,
                                                    readOnly = false,
                                                    className = '',
                                                  }) => {
  const [internalValue, setInternalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const characterCount = internalValue.length;
  const hasError = error && (errorMessage || error);

  // Определяем текущее состояние
  const isActive = internalValue.length > 0 && !disabled;

  // Формируем классы состояний
  const getStateClasses = () => {
    if (disabled) return 'text-area-wrapper--disabled';
    if (hasError) return 'text-area-wrapper--error';
    if (isFocused) return 'text-area-wrapper--focused';
    if (isHovered) return 'text-area-wrapper--hover';
    if (isActive) return 'text-area-wrapper--active';
    return 'text-area-wrapper--default';
  };

  // Альтернативно можно использовать data-атрибуты для CSS
  const getDataState = () => {
    if (disabled) return 'disabled';
    if (hasError) return 'error';
    if (isFocused) return 'focused';
    if (isHovered) return 'hover';
    if (isActive) return 'active';
    return 'default';
  };

  return (
    <div className={`text-area-container ${className}`}>
      {label && (
        <label
          className={`text-area-label ${disabled ? 'text-area-label--disabled' : ''}`}
        >
          {label}
        </label>
      )}

      <div
        className={`text-area-wrapper ${getStateClasses()}`}
        data-state={getDataState()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <textarea
          className="text-area-element"
          value={internalValue}
          placeholder={placeholder}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          readOnly={readOnly}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? 'error-message' : undefined}
        />

        {maxLength && (
          <div className="text-area-counter">
            {characterCount}/{maxLength}
          </div>
        )}
      </div>

      {hasError && (
        <div id="error-message" className="text-area-error" role="alert">
          {errorMessage || 'Ошибка'}
        </div>
      )}
    </div>
  );
};

export default TextArea;
