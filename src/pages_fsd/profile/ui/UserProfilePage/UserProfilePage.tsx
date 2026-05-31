'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMeQuery } from '@/features/auth/api/authApi';
import { Button, Typography } from '@/shared/ui';
import { PostGrid } from '@/entities/post/ui/PostGrid/PostGrid';
import { Loading } from '@/shared/ui/loading/Loading';
import { useLazyGetUserPostsQuery } from '@/entities/post/api/postApi';
import { useGetUserProfileQuery } from '@/pages_fsd/profile/api/profileApi';
import { useGetUserDetailedProfileQuery } from '@/entities/user';
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
  return (
    <UserProfilePageContent
      key={userId}
      userId={userId}
      initialProfile={initialProfile}
      initialPosts={initialPosts}
      initialPost={initialPost}
    />
  );
}

function UserProfilePageContent({
  userId,
  initialProfile,
  initialPosts,
}: Props) {
  const router = useRouter();
  const { data: currentUser } = useMeQuery();

  const isValidUserId = Number.isFinite(userId);
  const isOwnProfile = currentUser?.userId?.toString() === userId.toString();

  const { data: profileFromApi, isLoading: isProfileLoading } =
    useGetUserProfileQuery(userId, {
      skip: !isValidUserId,
      refetchOnMountOrArgChange: false,
    });

  const { data: detailedProfile } = useGetUserDetailedProfileQuery(userId, {
    skip: !isValidUserId,
    refetchOnMountOrArgChange: false,
  });

  const displayProfile = detailedProfile ?? profileFromApi ?? initialProfile;
  const followingCount =
    detailedProfile?.followingCount ?? displayProfile?.followingCount ?? 0;
  const followersCount =
    detailedProfile?.followersCount ?? displayProfile?.followersCount ?? 0;
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<Post[]>(initialPosts?.items ?? []);
  const [pagesCount, setPagesCount] = useState(initialPosts?.pagesCount ?? 1);
  const [getUserPosts, { isFetching }] = useLazyGetUserPostsQuery();

  const hasMore = page < pagesCount;

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (!isValidUserId) return;
    if (!hasMore) return;
    if (isFetching) return;
    if (lockRef.current) return;

    lockRef.current = true;
    const nextPage = page + 1;

    try {
      const result = await getUserPosts({
        userId: String(userId),
        pageNumber: nextPage,
        pageSize: PAGE_SIZE,
        sortBy: 'createdAt',
        sortDirection: 'desc',
      }).unwrap();

      setPage(nextPage);
      setPagesCount(result.pagesCount);
      setAllPosts((prev) => [...prev, ...result.items]);
    } finally {
      lockRef.current = false;
    }
  }, [getUserPosts, hasMore, isFetching, isValidUserId, page, userId]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        void loadMore();
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

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
            <Image
              src={avatarUrl}
              alt={displayProfile.username}
              width={200}
              height={200}
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
              <div className={s.statNumber}>{followingCount}</div>
              <div className={s.statLabel}>Following</div>
            </div>
            <div className={s.statItem}>
              <div className={s.statNumber}>{followersCount}</div>
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
        ) : (
          <Typography variant="regular_text_16" className={s.noPosts}>
            No posts yet
          </Typography>
        )}
      </div>
    </div>
  );
}
