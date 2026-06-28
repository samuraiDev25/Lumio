'use client';

import { useRouter } from 'next/navigation';
import { PostModal } from '@/entities/post/ui/PostModal/PostModal';
import { PostWithReaction } from '@/entities/post/model/types/postApi.types';
import type { UserProfile } from '@/pages_fsd/profile/modal/types/profileApi.types';
import { useState } from 'react';

type Props = {
  post: PostWithReaction;
  profile: UserProfile | null;
  profileId: number;
  from?: 'main' | 'profile';
  returnTo?: string;
};

export function PostPageClient({
  post,
  profile,
  profileId,
  from,
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
