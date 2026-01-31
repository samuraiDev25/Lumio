'use client';

import { useMeQuery } from '@/features/auth/api/authApi';
import { UnauthorizedMainPage } from './UnauthorizedMainPage';
import { AuthorizedMainPage } from './AuthorizedMainPage';
import { Post } from '@/features/posts/api/postApi.types';
import { handleNetworkError } from '@/shared/lib';
import { useEffect } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useAppDispatch } from '@/shared/hooks';

type MainPageClientWrapperProps = {
  serverPosts: Post[];
  serverUsersCount: number;
};

/**
 * Клиентский wrapper-компонент для главной страницы.
 *
 * Логика работы:
 * 1. Проверяет статус авторизации через useMeQuery.
 * 2. Пока идет загрузка или если пользователь не авторизован — рендерит UnauthorizedMainPage.
 * 3. Если авторизация подтверждена — рендерит AuthorizedMainPage.
 * 4. Реализует "тихую" обработку сетевых ошибок (игнорирует 401 статус для гостей).
 */
export function MainPageClientWrapper({
  serverPosts,
  serverUsersCount,
}: MainPageClientWrapperProps) {
  const { data: user, isLoading, error, isError } = useMeQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Проверяем, является ли ошибка объектом с полем status
    const fetchError = error as FetchBaseQueryError;

    // "Тихий режим" для гостей: 401 статус не является ошибкой в контексте Landing Page.
    // Обрабатываем только реальные сбои (500, 429 и т.д.) через глобальный хендлер.
    if (isError && fetchError && fetchError.status !== 401) {
      handleNetworkError({
        error,
        dispatch,
      });
    }
  }, [isError, error, dispatch]);

  if (isLoading || !user) {
    return (
      <UnauthorizedMainPage posts={serverPosts} usersCount={serverUsersCount} />
    );
  }
  return (
    <AuthorizedMainPage posts={serverPosts} usersCount={serverUsersCount} />
  );
}
