'use client';

import { FC } from 'react';
import s from './UsersCount.module.scss';

type UsersCountProps = {
  count: number;
};

/**
 * Component for displaying the total count of registered users.
 *
 * Features:
 * 1. Formatting: Pads the number with leading zeros up to 5 digits (e.g., "00042").
 * 2. Visualization: Each digit is rendered in a separate cell, separated by a vertical divider.
 * 3. Purpose: Used on the landing page to demonstrate the scale of the community.
 */
export const UsersCount: FC<UsersCountProps> = ({ count }) => {
  const formattedCount = count.toString().padStart(5, '0');

  const renderDigits = () => {
    return formattedCount.split('').map((digit, index) => {
      const isNotLast = index < formattedCount.length - 1;

      return (
        <div key={index} className={s['digit-wrapper']}>
          <span className={s.digit}>{digit}</span>
          {isNotLast && <div className={s.divider} />}
        </div>
      );
    });
  };

  return (
    <div className={s.container}>
      <span className={s.label}>Registered users:</span>
      <div className={s['numbers-container']}>{renderDigits()}</div>
    </div>
  );
};
