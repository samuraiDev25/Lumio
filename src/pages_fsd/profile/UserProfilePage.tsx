'use client';

import { useEffect, useRef, useState } from 'react';
import { useGetUserProfileQuery } from '@/features/profile/api/profileApi';
import { useGetMyPostsQuery } from '@/features/posts/api/postsApi';
import { useMeQuery } from '@/features/auth/api/authApi';
import { Button, Typography } from '@/shared/ui';
import { PROFILE_ROUTES } from '@/shared/lib/routes';
import { useRouter } from 'next/navigation';
import s from './UserProfilePage.module.scss';
import { PostGrid } from '@/features/posts/ui/PostGrid';
import { Loading } from '@/shared/ui/loading/Loading';
import { Post } from '@/features/posts/api/postsApi.types';

type UserProfilePageProps = {
  userId: string;
};

export function UserProfilePage({ userId }: UserProfilePageProps) {
  const router = useRouter();
  const { data: currentUser } = useMeQuery();
  const { data: profile, isLoading: isProfileLoading } = useGetUserProfileQuery(userId);
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const pageSize = 8;
  
  const isOwnProfile = currentUser?.userId === userId;
  
  const {
    data: postsData,
    isLoading: isPostsLoading,
    isFetching,
  } = useGetMyPostsQuery(
    isOwnProfile
      ? {
          pageNumber: page,
          pageSize,
          sortBy: 'createdAt',
          sortDirection: 'desc',
        }
      : undefined,
    { skip: !isOwnProfile }
  );

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const hasMore = postsData ? page < postsData.pagesCount : false;

  useEffect(() => {
    setPage(1);
    setAllPosts([]);
  }, [userId]);

  useEffect(() => {
    if (postsData?.items) {
      if (page === 1) {
        setAllPosts(postsData.items);
      } else {
        setAllPosts((prev) => [...prev, ...postsData.items]);
      }
    }
  }, [postsData, page]);

  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isFetching]);

  if (isProfileLoading) {
    return <Loading />;
  }

  if (!profile) {
    return (
      <div className={s.error}>
        <Typography variant="h2">User not found</Typography>
      </div>
    );
  }

  const avatarUrl = profile.avatarUrl || '';

  return (
    <div className={s.profilePage}>
      <div className={s.profileHeader}>
        <div className={s.avatarContainer}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={profile.username} className={s.avatar} />
          ) : (
            <div className={s.avatarPlaceholder}>
              <Typography variant="h1">{profile.username[0]?.toUpperCase()}</Typography>
            </div>
          )}
        </div>
        <div className={s.profileInfo}>
          <Typography variant="h1" className={s.username}>
            {profile.username}
          </Typography>
          {profile.aboutMe && (
            <Typography variant="regular_text_16" className={s.aboutMe}>
              {profile.aboutMe}
            </Typography>
          )}
          {isOwnProfile && (
            <Button
              variant="primary"
              size="md"
              onClick={() => router.push(PROFILE_ROUTES.SETTINGS)}
              className={s.settingsButton}
            >
              Profile Setting
            </Button>
          )}
        </div>
      </div>

      <div className={s.postsSection}>
        <Typography variant="h2" className={s.postsTitle}>
          Posts
        </Typography>
        {allPosts.length > 0 ? (
          <>
            <PostGrid posts={allPosts} />
            {isFetching && (
              <div className={s.loading}>
                <Loading />
              </div>
            )}
            {hasMore && <div ref={loadMoreRef} className={s.loadMoreTrigger} />}
          </>
        ) : isPostsLoading ? (
          <div className={s.loading}>
            <Loading />
          </div>
        ) : (
          <Typography variant="regular_text_16" className={s.noPosts}>
            No posts yet
          </Typography>
        )}
      </div>
    </div>
  );
}

