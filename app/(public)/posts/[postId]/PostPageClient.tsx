'use client';

import { useRouter } from 'next/navigation';
import { PostModal } from '@/widgets/postModal/ui/PostModal';
import { Post } from '@/features/posts/api/postApi.types';

type Props = {
  post: Post;
};

export function PostPageClient({ post }: Props) {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
      }}
    >
      <PostModal
        post={post}
        userName={post?.userName || 'Avatar'}
        avatarUrl={post?.avatarUrl || './User 03.jpg'}
        isOpen={true}
        onCloseAction={() => router.back()}
      />
    </div>
  );
}
