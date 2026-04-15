'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMeQuery } from '@/features/auth/api/authApi';
import { Button, Typography } from '@/shared/ui';
import { PostGrid } from '@/entities/post/ui/PostGrid/PostGrid';
import { Loading } from '@/shared/ui/loading/Loading';
import { useGetUserPostsQuery } from '@/entities/post/api/postApi';
import { useGetUserProfileQuery } from '@/pages_fsd/profile/api/profileApi';
import {
  GetMyPostsResponse,
  Post,
} from '@/entities/post/model/types/postApi.types';
import { UserProfile } from '@/pages_fsd/profile/modal/types/profileApi.types';
import s from './UserProfilePage.module.scss';

type Props = {
  userId: number;
  initialProfile: UserProfile | null;
  initialPosts: GetMyPostsResponse;
  initialPost: Post | null;
};

const PAGE_SIZE = 8;

export function UserProfilePage({
  userId,
  initialProfile,
  initialPosts,
  initialPost,
}: Props) {
  const router = useRouter();
  const { data: currentUser } = useMeQuery();

  const [isPostOpen, setIsPostOpen] = useState(!!initialPost);

  useEffect(() => {
    setIsPostOpen(!!initialPost);
  }, [initialPost]);

  const isValidUserId = Number.isFinite(userId);
  const isOwnProfile = currentUser?.userId?.toString() === userId.toString();

  const { data: profileFromApi, isLoading: isProfileLoading } =
    useGetUserProfileQuery(userId, {
      skip: !isValidUserId,
      refetchOnMountOrArgChange: false,
    });

  const displayProfile = profileFromApi ?? initialProfile;

  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<Post[]>(initialPosts?.items ?? []);

  const queryArgs = useMemo(
    () => ({
      userId,
      pageNumber: page,
      pageSize: PAGE_SIZE,
      sortBy: 'createdAt',
      sortDirection: 'desc' as const,
    }),
    [userId, page],
  );

  const {
    data: postsData,
    isLoading: isPostsLoading,
    isFetching,
  } = useGetUserPostsQuery(queryArgs, {
    skip: !isValidUserId,
    refetchOnMountOrArgChange: false,
  });

  const pagesCount = postsData?.pagesCount ?? initialPosts?.pagesCount ?? 1;

  const hasMore = page < pagesCount;

  useEffect(() => {
    setPage(1);
    setAllPosts(initialPosts?.items ?? []);
  }, [userId, initialPosts]);

  useEffect(() => {
    if (!postsData?.items) return;

    if (page === 1) {
      setAllPosts(postsData.items);
    } else {
      setAllPosts((prev) => [...prev, ...postsData.items]);
    }
  }, [postsData, page]);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);

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
    if (isProfileLoading) return <Loading />;

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
              <Typography variant="h1">{displayProfile.username}</Typography>
            </div>
          )}
        </div>

        <div className={s.profileInfo}>
          <div className={s.profileHeaderSection}>
            <Typography variant="h1" className={s.username}>
              {displayProfile.username}
            </Typography>

            {isOwnProfile && (
              <Button
                variant="secondary"
                size="md"
                onClick={() => router.push('/settings?part=info')}
                className={s.settingsButton}
              >
                Profile Setting
              </Button>
            )}
          </div>

          <div className={s.stats}>
            <div className={s.statItem}>
              <div className={s.statNumber}>Заглушка</div>
              <div className={s.statLabel}>Following</div>
            </div>
            <div className={s.statItem}>
              <div className={s.statNumber}>Заглушка</div>
              <div className={s.statLabel}>Followers</div>
            </div>
            <div className={s.statItem}>
              <div className={s.statNumber}>
                {initialPosts?.totalCount ?? 0}
              </div>
              <div className={s.statLabel}>Publications</div>
            </div>
          </div>
          {displayProfile.aboutMe && (
            <div>
              <Typography variant="regular_text_16" className={s.aboutMe}>
                {displayProfile.aboutMe}
              </Typography>
            </div>
          )}
        </div>
      </div>

      <div className={s.postsSection}>
        {allPosts.length > 0 ? (
          <>
            <PostGrid
              posts={allPosts}
              profileId={Number(userId)}
              from="profile"
            />

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
