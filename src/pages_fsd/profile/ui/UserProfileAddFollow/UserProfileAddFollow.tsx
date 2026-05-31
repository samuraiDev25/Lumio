'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMeQuery } from '@/features/auth/api/authApi';
import {
  useFollowUserMutation,
  useGetUserDetailedProfileQuery,
  useUnfollowUserMutation,
  UserDetailedProfile,
} from '@/entities/user';
import { Button, Typography } from '@/shared/ui';
import { Loading } from '@/shared/ui/loading/Loading';
import { PostGrid } from '@/entities/post/ui/PostGrid/PostGrid';
import { useGetUserPostsQuery } from '@/entities/post/api/postApi';
import {
  GetMyPostsResponse,
  Post,
} from '@/entities/post/model/types/postApi.types';
import { UserProfile } from '@/pages_fsd/profile/modal/types/profileApi.types';
import { getUserProfileRoute } from '@/shared/lib/routes/routes';
import s from '../UserProfilePage/UserProfilePage.module.scss';

type Props = {
  userId: number;
  initialProfile: UserProfile | null;
  initialPosts: GetMyPostsResponse;
  initialPost: Post | null;
};

type ProfileWithFollowInfo = UserProfile | UserDetailedProfile;

const PAGE_SIZE = 8;

const hasDetailedProfileInfo = (
  profile: ProfileWithFollowInfo | null,
): profile is UserDetailedProfile => {
  if (!profile) return false;

  return 'postsCount' in profile && 'isCurrentUser' in profile;
};

const getFollowersCount = (profile: ProfileWithFollowInfo | null) =>
  hasDetailedProfileInfo(profile) ? profile.followersCount : 0;

const getFollowingCount = (profile: ProfileWithFollowInfo | null) =>
  hasDetailedProfileInfo(profile) ? profile.followingCount : 0;

const getPublicationsCount = (
  profile: ProfileWithFollowInfo | null,
  posts: GetMyPostsResponse,
) => {
  if (!hasDetailedProfileInfo(profile)) {
    return posts?.totalCount ?? 0;
  }

  return profile.postsCount;
};

const getIsFollowing = (profile: ProfileWithFollowInfo | null) =>
  hasDetailedProfileInfo(profile) ? profile.isFollowing : false;

export function UserProfileAddFollow({
  userId,
  initialProfile,
  initialPosts,
}: Props) {
  const router = useRouter();
  const { data: currentUser } = useMeQuery();
  const [followUser, { isLoading: isFollowLoading }] = useFollowUserMutation();
  const [unfollowUser, { isLoading: isUnfollowLoading }] =
    useUnfollowUserMutation();

  const isValidUserId = Number.isFinite(userId);
  const currentUserId = currentUser?.userId ? Number(currentUser.userId) : null;

  const { data: profileFromApi, isLoading: isProfileLoading } =
    useGetUserDetailedProfileQuery(userId, {
      skip: !isValidUserId,
      refetchOnMountOrArgChange: false,
    });

  const displayProfile =
    (profileFromApi as ProfileWithFollowInfo | undefined) ?? initialProfile;
  const isOwnProfile = hasDetailedProfileInfo(displayProfile)
    ? displayProfile.isCurrentUser
    : currentUserId === userId;

  const [isFollowing, setIsFollowing] = useState(
    getIsFollowing(initialProfile as ProfileWithFollowInfo | null),
  );
  const [followersCount, setFollowersCount] = useState(
    getFollowersCount(initialProfile as ProfileWithFollowInfo | null),
  );
  const [followingCount, setFollowingCount] = useState(
    getFollowingCount(initialProfile as ProfileWithFollowInfo | null),
  );

  useEffect(() => {
    setIsFollowing(getIsFollowing(displayProfile));
    setFollowersCount(getFollowersCount(displayProfile));
    setFollowingCount(getFollowingCount(displayProfile));
  }, [displayProfile]);

  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<Post[]>(initialPosts?.items ?? []);

  const queryArgs = useMemo(
    () => ({
      userId: String(userId),
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

  const handleFollowClick = async () => {
    if (isOwnProfile || !currentUserId) return;
    if (isFollowLoading || isUnfollowLoading) return;

    try {
      if (isFollowing) {
        await unfollowUser({ userId }).unwrap();
        setIsFollowing(false);
        setFollowersCount((count: number) => Math.max(count - 1, 0));
        return;
      }

      const followResult = await followUser({ userId, currentUserId }).unwrap();

      setIsFollowing(followResult?.isFollowing ?? true);
      setFollowersCount(followResult?.followersCount ?? followersCount + 1);
      setFollowingCount(followResult?.followingCount ?? followingCount);
    } catch {
      setIsFollowing(isFollowing);
      setFollowersCount(getFollowersCount(displayProfile));
      setFollowingCount(getFollowingCount(displayProfile));
    }
  };

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

            {!isOwnProfile && (
              <div className={s['profile-actions']}>
                <Button
                  variant={isFollowing ? 'outline' : 'primary'}
                  size="sm"
                  onClick={handleFollowClick}
                  disabled={
                    !currentUserId || isFollowLoading || isUnfollowLoading
                  }
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => router.push('/messenger')}
                >
                  Send Message
                </Button>
              </div>
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
                {getPublicationsCount(displayProfile, initialPosts)}
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
              returnTo={getUserProfileRoute(String(userId))}
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
