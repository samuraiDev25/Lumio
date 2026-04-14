'use client';

import { useMeQuery } from '@/features/auth/api/authApi';
import { UserProfilePage } from '@/pages_fsd/profile';
import { BaseLayout } from '@/app/BaseLayout';
import {
  GetMyPostsResponse,
  Post,
} from '@/entities/post/model/types/postApi.types';
import { UserProfile } from '@/pages_fsd/profile/modal/types/profileApi.types';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useAppDispatch } from '@/shared/hooks';
import { profileApi } from '@/pages_fsd/profile/api/profileApi';
import { postsApi } from '@/entities/post/api/postApi';
import { PROFILE_ROUTES } from '@/shared/lib/routes';

type Props = {
  userId: number;
  initialProfile: UserProfile | null;
  initialPosts: GetMyPostsResponse;
  initialPost: Post | null;
};

const PAGE_SIZE = 8;

export function UserProfileClientShell({
  userId,
  initialProfile,
  initialPosts,
  initialPost,
}: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: me, isLoading } = useMeQuery();

  const firstPageArgs = useMemo(
    () => ({
      userId,
      pageNumber: 1,
      pageSize: PAGE_SIZE,
      sortBy: 'createdAt',
      sortDirection: 'desc' as const,
    }),
    [userId],
  );

  useEffect(() => {
    if (initialProfile) {
      dispatch(
        profileApi.util.upsertQueryData(
          'getUserProfile',
          userId,
          initialProfile,
        ),
      );
    }

    if (initialPosts) {
      dispatch(
        postsApi.util.upsertQueryData(
          'getUserPosts',
          firstPageArgs,
          initialPosts,
        ),
      );
    }
  }, [dispatch, userId, firstPageArgs, initialProfile, initialPosts]);

  const isAuth = !!me;

  useEffect(() => {
    if (!isLoading && isAuth && initialProfile === null) {
      router.push(PROFILE_ROUTES.SETTINGS_PART('info'));
    }
  }, [isLoading, isAuth, initialProfile, router]);

  if (!isAuth) {
    return (
      <UserProfilePage
        userId={userId}
        initialProfile={initialProfile}
        initialPosts={initialPosts}
        initialPost={initialPost}
      />
    );
  }

  return (
    <BaseLayout>
      <UserProfilePage
        userId={userId}
        initialProfile={initialProfile}
        initialPosts={initialPosts}
        initialPost={initialPost}
      />
    </BaseLayout>
  );
}
