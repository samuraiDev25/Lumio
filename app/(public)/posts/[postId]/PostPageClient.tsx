'use client';

import { Post } from '@/entities/post/model/types/postApi.types';
import { useRouter } from 'next/navigation';
import { PostModal } from '@/entities/post/ui/PostModal/PostModal';
type Props = {
  post: Post;
};

export function PostPageClient({ post }: Props) {
  const router = useRouter();

  return (
    <PostModal
      post={post}
      userName={post.userName || 'Avatar'}
      avatarUrl={post.avatarUrl || '/User 03.jpg'}
      isOpen={true}
      onCloseAction={() => router.back()}
    />
  );
}
