'use client';

import { useRouter } from 'next/navigation';
import { PostModal } from '@/entities/post/ui/PostModal/PostModal';
import { Post } from '@/entities/post/model/types/postApi.types';
import type { UserProfile } from '@/pages_fsd/profile/modal/types/profileApi.types';
import { useState } from 'react';

type Props = {
  post: Post;
  profile: UserProfile | null;
  from?: 'main' | 'profile';
  profileId: number;
  returnTo?: string;
};

export function InterceptedPostModalClient({
  post,
  profile,
  from,
  profileId,
  returnTo,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    if (returnTo?.startsWith('/')) {
      router.push(returnTo, { scroll: false });
      return;
    }

    if (from === 'main') {
      router.push('/', { scroll: false });
      return;
    }
    const fallbackProfileId = Number.isFinite(profileId)
      ? profileId
      : post.userId;
    router.push(`/profile/${fallbackProfileId}`, { scroll: false });
  };

  return (
    <PostModal
      post={post}
      profile={profile}
      isOpen={open}
      onCloseAction={handleClose}
    />
  );
}
