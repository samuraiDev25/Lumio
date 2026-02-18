'use client';

import { useEffect, useRef, useState } from 'react';
import { useGetUserProfileQuery } from '@/entities/profile/api/profileApi';

import { useMeQuery } from '@/features/auth/api/authApi';
import { Button, Typography } from '@/shared/ui';
import { PROFILE_ROUTES } from '@/shared/lib/routes';
import { useRouter } from 'next/navigation';
import s from './UserProfilePage.module.scss';
import { PostGrid } from '@/entities/post/ui/PostGrid/PostGrid';
import { Loading } from '@/shared/ui/loading/Loading';
import { Post } from '@/entities/post/model/types/postApi.types';
import { useGetMyPostsQuery } from '@/entities/post/api/postApi';

type UserProfilePageProps = {
  userId: string;
};

export function UserProfilePage({ userId }: UserProfilePageProps) {
  const router = useRouter();
  const { data: currentUser } = useMeQuery();

  const { data: profile, isLoading: isProfileLoading } =
    useGetUserProfileQuery(userId);

  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const pageSize = 8;
  const isOwnProfile = currentUser?.userId?.toString() === userId;
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
    { skip: !isOwnProfile },
  );

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const hasMore = postsData ? page < postsData.pagesCount : false;

  useEffect(() => {
    setPage(1);
    setAllPosts([]);
  }, [userId, setPage]);

  useEffect(() => {
    if (postsData?.items) {
      if (page === 1) {
        setAllPosts(postsData.items);
      } else {
        setAllPosts((prev) => [...prev, ...postsData.items]);
      }
    }
  }, [postsData, page, setAllPosts]);

  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
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
  // Это временно, для того пока пост не создан, что бы отображались данные юзера
  const displayProfile =
    profile ||
    (isOwnProfile && currentUser
      ? {
          id: currentUser.userId,
          username: currentUser.username,
          firstName: null,
          lastName: null,
          dateOfBirth: null,
          country: null,
          city: null,
          aboutMe: null,
          avatarUrl: null,
        }
      : null);
  if (!displayProfile) {
    return (
      <div className={s.error}>
        <Typography variant="h2">User not found</Typography>
      </div>
    );
  }

  const avatarUrl = displayProfile.avatarUrl || '';

  return (
    <div className={s.profilePage}>
      <div className={s.profileHeader}>
        <div className={s.avatarContainer}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayProfile.username}
              className={s.avatar}
            />
          ) : (
            <div className={s.avatarPlaceholder}>
              <Typography variant="h1">
                {displayProfile.username[0]?.toUpperCase()}
              </Typography>
            </div>
          )}
        </div>
        <div className={s.profileInfo}>
          <div className={s.profileHeaderSection}>
            <Typography variant="h1" className={s.username}>
              {displayProfile.username}
            </Typography>
            {displayProfile.aboutMe && (
              <Typography variant="regular_text_16" className={s.aboutMe}>
                {displayProfile.aboutMe}
              </Typography>
            )}

            {isOwnProfile && (
              <Button
                variant="secondary"
                size="md"
                onClick={() => router.push(PROFILE_ROUTES.SETTINGS)}
                className={s.settingsButton}
              >
                Profile Setting
              </Button>
            )}
          </div>
          <div className={s.stats}>
            <div className={s.statItem}>
              <div className={s.statNumber}>Following</div>
              <div className={s.statLabel}>Following</div>
            </div>
            <div className={s.statItem}>
              <div className={s.statNumber}>Followers</div>
              <div className={s.statLabel}>Followers</div>
            </div>
            <div className={s.statItem}>
              <div className={s.statNumber}>Publications</div>
              <div className={s.statLabel}>Publications</div>
            </div>
          </div>
          <p className={s.text}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
            <a className={s.textLink}>
              laboris nisi ut aliquip ex ea commodo consequat.
            </a>
          </p>
        </div>
      </div>

      <div className={s.postsSection}>
        {allPosts?.length > 0 ? (
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
