'use client';

import { useRouter } from 'next/navigation';
import { PostModal } from '@/entities/post/ui/PostModal/PostModal';
import { Post } from '@/entities/post/model/types/postApi.types';
import type { UserProfile } from '@/pages_fsd/profile/modal/types/profileApi.types';
import { useState } from 'react';

type Props = {
  post: Post;
  profile: UserProfile | null;
  profileId: string | undefined;
  from?: 'main' | 'profile';
};

export function PostPageClient({ post, profile, profileId, from }: Props) {
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
      profile={profile}
      isOpen={open}
      onCloseAction={handleClose}
    />
  );
}
