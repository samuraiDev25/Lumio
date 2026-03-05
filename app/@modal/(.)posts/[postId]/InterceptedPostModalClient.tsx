'use client';

import { useRouter } from 'next/navigation';
import { PostModal } from '@/entities/post/ui/PostModal/PostModal';
import { Post } from '@/entities/post/model/types/postApi.types';
import { useState } from 'react';

type Props = {
  post: Post;
  from?: 'main' | 'profile';
  profileId: number;
};

export function InterceptedPostModalClient({ post, from, profileId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    if (from === 'main') {
      router.push('/', { scroll: false });
      return;
    }
    router.push(`/profile/${profileId}`, { scroll: false });
  };

  return (
    <PostModal
      post={post}
      userName={post.userName || 'Avatar'}
      avatarUrl={post.avatarUrl || '/User 03.jpg'}
      isOpen={open}
      onCloseAction={handleClose}
    />
  );
}
