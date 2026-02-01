'use client';

import { FC } from 'react';
import s from './UsersCount.module.scss';

type UsersCountProps = {
  count: number;
};

/**
 * Компонент счетчика зарегистрированных пользователей.
 *
 * Особенности:
 * 1. Форматирует число до 5 знаков, заполняя пустые разряды нулями (напр. "00042").
 * 2. Визуально разделяет каждую цифру вертикальной линией (divider).
 * 3. Используется на главной странице для отображения масштаба сообщества.
 */
export const UsersCount: FC<UsersCountProps> = ({ count }) => {
  // Дополняем строку нулями слева до 5 символов
  const formattedCount = count.toString().padStart(5, '0');

  return (
    <div className={s.container}>
      <span className={s.label}>Registered users:</span>

      <div className={s['numbers-container']}>
        {formattedCount.split('').map((digit, index) => (
          <div key={index} className={s['digit-wrapper']}>
            <span className={s.digit}>{digit}</span>
            {index < formattedCount.length - 1 && <div className={s.divider} />}
          </div>
        ))}
      </div>
    </div>
  );
};
