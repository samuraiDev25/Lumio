'use client';

import { useMeQuery } from '@/features/auth/api/authApi';
import { UserProfilePage } from '@/pages_fsd/profile';
import { BaseLayout } from '@/app/BaseLayout';
import { GetMyPostsResponse } from '@/entities/post/model/types/postApi.types';
import { UserProfile } from '@/pages_fsd/profile/modal/types/profileApi.types';
import { useRouter } from 'next/navigation';

type Props = {
  userId: number;
  initialProfile: UserProfile | null;
  initialPosts: GetMyPostsResponse;
};

export function UserProfileClientShell({
  userId,
  initialProfile,
  initialPosts,
}: Props) {
  const router = useRouter();
  const { data: me } = useMeQuery();
  const isAuth = !!me;
  if (isAuth && userId) router.push(`/settings?part=info`);
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
