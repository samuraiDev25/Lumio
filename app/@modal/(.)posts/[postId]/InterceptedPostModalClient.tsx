'use client';

import { useRouter } from 'next/navigation';
import { PostModal } from '@/widgets/postModal/ui/PostModal';
import { Post } from '@/entities/post/model/types/postApi.types';

type Props = {
  post: Post;
};

export function InterceptedPostModalClient({ post }: Props) {
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
