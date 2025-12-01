import React from 'react';
import './ExampleButton.scss';

type Props = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
};

export const ExampleButton = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
}: Props) => {
  return (
    <button
      className={`ex-btn ex-btn-${variant} ex-btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
