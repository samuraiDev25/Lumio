'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui';
import { Modal } from '@/shared/ui/modal/Modal';
import { logoutUser, clearAuthData, getUserEmail } from '@/features/logout/api';
import clsx from 'clsx';
import s from './LogOutButton.module.scss';

export type LogOutButtonProps = {
  /** Колбэк при нажатии на кнопку выхода */
  onLogout?: () => void;
  /** Вариант кнопки */
  variant?: 'primary' | 'secondary' | 'outline' | 'link';
  /** Размер кнопки */
  size?: 'sm' | 'md' | 'lg';
  /** Показать иконку */
  showIcon?: boolean;
  /** Текст кнопки */
  children?: React.ReactNode;
  /** Дополнительный className */
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick'>;

export const LogOutButton: React.FC<LogOutButtonProps> = ({
  onLogout,
  variant = 'outline',
  size = 'md',
  showIcon = false,
  children = 'Log out',
  className,
  ...props
}) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Обновляем email при монтировании и при открытии модалки
  useEffect(() => {
    const updateEmail = () => {
      setUserEmail(getUserEmail());
    };

    updateEmail();
    // Обновляем email при открытии модалки
    if (isModalOpen) {
      updateEmail();
    }
  }, [isModalOpen]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsModalOpen(true);
    setShowErrorMessage(false);
    setApiError(null);
  };

  const handleConfirm = async () => {
    // Защита от множественных кликов
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setApiError(null);

    // Используем API функцию из api слоя
    const result = await logoutUser();

    if (result.success) {
      // Успешный выход - очищаем все данные авторизации
      clearAuthData();

      // Вызываем колбэк перед закрытием модалки
      onLogout?.();
      setIsModalOpen(false);

      // Редирект с обработкой возможных ошибок
      try {
        router.push('/auth/sign-in');
      } catch (routerError) {
        console.error('Router error:', routerError);
        // Fallback на window.location если router не работает
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/sign-in';
        }
      }
    } else {
      // Показываем ошибку
      setApiError(result.error || 'An error occurred during logout');
    }

    setIsLoading(false);
  };

  const handleCancel = () => {
    if (!showErrorMessage) {
      // Показываем сообщение об ошибке при первом нажатии на No
      setShowErrorMessage(true);
    } else {
      // При повторном нажатии закрываем модалку
      closeModal();
    }
  };

  const closeModal = () => {
    // Сбрасываем все состояния при закрытии модалки
    setIsModalOpen(false);
    setShowErrorMessage(false);
    setApiError(null);
    setIsLoading(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className={clsx(s.logOutButton, className)}
        {...props}
      >
        {children}
      </Button>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={'Log out'}
        size={'sm'}
        showCloseButton
      >
        {showErrorMessage ? (
          <>
            <div className={s.message}>
              {`User with this email doesn't exist`}
            </div>
            <div className={s.actions}>
              <Button variant={'primary'} size={'sm'} onClick={closeModal}>
                Close
              </Button>
            </div>
          </>
        ) : apiError ? (
          <>
            <div className={s.message}>
              {apiError}
            </div>
            <div className={s.actions}>
              <Button variant={'primary'} size={'sm'} onClick={closeModal}>
                Close
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className={s.message}>
              {`Are you really want to log out of your account "${userEmail || 'your account'}"?`}
            </div>
            <div className={s.actions}>
              <Button
                variant={'primary'}
                size={'sm'}
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Yes'}
              </Button>
              <Button variant={'outline'} size={'sm'} onClick={handleCancel} disabled={isLoading}>
                No
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

