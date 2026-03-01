'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useMeQuery } from '@/features/auth/api/authApi';
import { Button, Typography } from '@/shared/ui';
import { useRouter } from 'next/navigation';
import s from './UserProfilePage.module.scss';
import { PostGrid } from '@/entities/post/ui/PostGrid/PostGrid';
import { Loading } from '@/shared/ui/loading/Loading';
import {
  GetMyPostsResponse,
  Post,
} from '@/entities/post/model/types/postApi.types';
import { useGetMyPostsQuery } from '@/entities/post/api/postApi';
import { useGetUserProfileQuery } from '@/pages_fsd/profile/api/profileApi';
import { UserProfile } from '@/pages_fsd/profile/modal/types/profile.types';

type UserProfilePageProps = {
  userId: string;
  initialProfile: UserProfile;
  initialPosts: GetMyPostsResponse;
};


const PAGE_SIZE = 8;

export function UserProfilePage({
  userId,
  initialProfile,
  initialPosts,
}: UserProfilePageProps) {
  const router = useRouter();
  const { data: currentUser } = useMeQuery();

  const userIdNumber = useMemo(() => Number(userId), [userId]);
  // const isValidUserId = Number.isFinite(userIdNumber); ХЗ, если на до позже добавлю

  const isOwnProfile = currentUser?.userId?.toString() === userId;
  const { data: profileFromApi, isLoading: isProfileLoading } =
    useGetUserProfileQuery(userIdNumber);

  const displayProfile = profileFromApi ?? initialProfile;
  console.log(initialProfile);

  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<Post[]>(initialPosts?.items ?? []);

  const pagesCount = initialPosts?.pagesCount ?? 1;

  const {
    data: postsData,
    isLoading: isPostsLoading,
    isFetching,
  } = useGetMyPostsQuery(
    isOwnProfile
      ? {
          pageNumber: page,
          pageSize: PAGE_SIZE,
          sortBy: 'createdAt',
          sortDirection: 'desc',
        }
      : {
          pageNumber: page,
          pageSize: PAGE_SIZE,
          sortBy: 'createdAt',
          sortDirection: 'desc',
        },
    { skip: false },
  );

  const hasMore = isOwnProfile
    ? postsData
      ? page < postsData.pagesCount
      : page < pagesCount
    : false;

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);

  useEffect(() => {
    setPage(1);
    setAllPosts(initialPosts?.items ?? []);
    lockRef.current = false;
  }, [userId, initialPosts]);

  useEffect(() => {
    if (!postsData?.items) return;

    if (page === 1) {
      setAllPosts(postsData.items);
    } else {
      setAllPosts((prev) => [...prev, ...postsData.items]);
    }
  }, [postsData, page]);

  useEffect(() => {
    if (!isFetching) lockRef.current = false;
  }, [isFetching]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;

        if (!hasMore) return;
        if (isFetching) return;
        if (lockRef.current) return;

        lockRef.current = true;
        setPage((prev) => prev + 1);
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  if (!displayProfile) {
    if (isProfileLoading) {
      return <Loading />;
    }

    return (
      <div className={s.error}>
        <Typography variant="h2">User not found1</Typography>
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
              <Typography variant="h1">{displayProfile.username}</Typography>
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
                onClick={() => router.push(`/profile/fill/${userId}`)}
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
        ) : isOwnProfile && isPostsLoading ? (
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
