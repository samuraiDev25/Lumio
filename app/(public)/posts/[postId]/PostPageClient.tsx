'use client';

import { Post } from '@/entities/post/model/types/postApi.types';
import { useRouter } from 'next/navigation';
import { PostModal } from '@/entities/post/ui/PostModal/PostModal';
import { useMeQuery } from '@/features/auth/api/authApi';
import { Loading } from '@/shared/ui/loading/Loading';
import { useGetPostByIdQuery } from '@/entities/post/api/postApi';

type Props = {
  post: Post;
};

export function PostPageClient({ post }: Props) {
  const router = useRouter();
  const { data: user, isLoading: isUserLoading } = useMeQuery();
  const { data: updatedPost, isLoading: isPostLoading, isError } = useGetPostByIdQuery(
    post.id.toString(),
    {
      skip: !user, // Загружаем обновленный пост только после авторизации
    },
  );

  // Пока загружается информация о пользователе, показываем лоадер
  if (isUserLoading) {
    return <Loading />;
  }

  // Используем данные из кэша RTK Query, если они есть, иначе - серверные
  const currentPost = updatedPost || post;

  return (
    <PostModal
      post={currentPost}
      userName={currentPost.userName || 'User'}
      avatarUrl={currentPost.avatarUrl || '/User 03.jpg'}
      isOpen={true}
      onCloseAction={() => router.back()}
    />
  );
}
