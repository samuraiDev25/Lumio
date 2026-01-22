'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui';
import { Modal } from '@/shared/ui/modal/Modal';
import { useLogoutMutation } from '@/features/auth/api/authApi';
import { clearAuthData, getUserEmail } from '@/features/auth/api/authUtils';
import clsx from 'clsx';
import s from './LogOutButton.module.scss';
import { AUTH_ROUTES } from '@/shared/lib/routes';

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
  const [logout, { isLoading }] = useLogoutMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
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

    setApiError(null);

    try {
      await logout().unwrap();

      // Успешный выход - очищаем все данные авторизации
      clearAuthData();

      // Вызываем колбэк перед закрытием модалки
      onLogout?.();
      setIsModalOpen(false);

      // Редирект на страницу логина
      // Используем replace вместо push, чтобы нельзя было вернуться назад
      try {
        router.replace(AUTH_ROUTES.SIGN_IN);
      } catch (routerError) {
        console.error('Router error:', routerError);
        // Fallback на window.location если router не работает
        if (typeof window !== 'undefined') {
          window.location.replace(AUTH_ROUTES.SIGN_IN);
        }
      }
    } catch (err: any) {
      // Обработка ошибок RTK Query
      if (
        err?.data?.errorMessages &&
        Array.isArray(err.data.errorMessages) &&
        err.data.errorMessages.length > 0
      ) {
        setApiError(err.data.errorMessages[0].message);
      } else if (err?.data?.message) {
        setApiError(err.data.message);
      } else if (err?.message) {
        setApiError(err.message);
      } else {
        setApiError('An error occurred during logout');
      }
    }
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
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className={clsx(s.logOutButton, className)}
        style={{
          width: '100%',
          justifyContent: 'flex-start',
          textAlign: 'left',
        }}
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
            <div className={s.message}>{apiError}</div>
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
              <Button
                variant={'outline'}
                size={'sm'}
                onClick={handleCancel}
                disabled={isLoading}
              >
                No
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};
