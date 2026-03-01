'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Post } from '@/entities/post/model/types/postApi.types';
import { PostModal } from './PostModal';
import { useMeQuery } from '@/features/auth/api/authApi';
import { useGetPostByIdQuery } from '@/entities/post/api/postApi';
import { useAppDispatch } from '@/shared/hooks';
import { postsApi } from '@/entities/post/api/postApi';

type Props = {
  post: Post;
};

export function PostModalClient({ post }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { data: user, isLoading: isUserLoading } = useMeQuery();
  
  // Предварительно загружаем данные в RTK Query кэш
  useEffect(() => {
    dispatch(
      postsApi.util.upsertQueryData('getPostById', post.id.toString(), post)
    );
  }, [dispatch, post]);

  const { data: updatedPost, isLoading: isPostLoading, isError } = useGetPostByIdQuery(
    post.id.toString(),
    {
      skip: !user, // Загружаем обновленный пост только после авторизации
    },
  );

  // Определяем, откуда пришел пользователь для правильного редиректа
  const getRedirectPath = () => {
    const referer = document.referrer || '';
    
    // Если пришли со страницы профиля или по прямой ссылке
    if (referer.includes('/profile') || referer.includes('/posts')) {
      return `/profile/${user?.userId || ''}`;
    }
    
    // Если пришли с главной страницы
    return '/';
  };

  const handleClose = () => {
    // Выполняем редирект на нужную страницу
    const redirectPath = getRedirectPath();
    router.push(redirectPath);
  };


  // Используем данные из кэша RTK Query, если они есть, иначе - серверные
  const currentPost = updatedPost || post;

  return (
    <PostModal
      post={currentPost}
      userName={currentPost.userName || 'User'}
      avatarUrl={currentPost.avatarUrl || '/User 03.jpg'}
      isOpen={true}
      onCloseAction={handleClose}
    />
  );
}