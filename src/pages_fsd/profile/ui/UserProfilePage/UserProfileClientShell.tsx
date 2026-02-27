'use client';

import { useMeQuery } from '@/features/auth/api/authApi';
import { UserProfilePage } from '@/pages_fsd/profile';
import { BaseLayout } from '@/app/BaseLayout';
import { GetMyPostsResponse } from '@/entities/post/model/types/postApi.types';
import { UserProfile } from '@/entities/profile/modal/types/profileApi.types';

type Props = {
  userId: string;
  initialProfile: UserProfile;
  initialPosts: GetMyPostsResponse;
};

export function UserProfileClientShell({
  userId,
  initialProfile,
  initialPosts,
}: Props) {
  const { data: me } = useMeQuery();
  const isAuth = !!me;

  if (!isAuth) {
    return (
      <UserProfilePage
        userId={userId}
        initialProfile={initialProfile}
        initialPosts={initialPosts}
      />
    );
  }

  return (
    <BaseLayout>
      <UserProfilePage
        userId={userId}
        initialProfile={initialProfile}
        initialPosts={initialPosts}
      />
    </BaseLayout>
  );
}
