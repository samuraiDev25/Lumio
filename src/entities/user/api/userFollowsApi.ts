import { baseApi } from '@/shared/api/baseApi';

export type SearchUser = {
  id: number;
  userName: string;
  avatarUrl: string | null;
};

export type UserDetailedProfile = {
  id: number;
  username: string;
  aboutMe: string | null;
  avatarUrl: string | null;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing: boolean;
  isCurrentUser: boolean;
};

export type FollowUserResponse = {
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
};

export type UserFollowInfo = {
  followersCount: number;
  followingCount: number;
};

export type UserFeedPostFile = {
  id: number;
  url: string;
  postId: number | string;
};

export type UserFeedPost = {
  id: string;
  description: string;
  createdAt: string;
  userId: number;
  username: string;
  avatarUrl: string | null;
  postFiles: UserFeedPostFile[];
  likesCount?: number;
  likeCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
  userReaction?: 'like' | 'dislike' | 'none';
};

export type UserFeedResponse = {
  items: UserFeedPost[];
  totalCount: number;
  pagesCount: number;
  page: number;
  pageSize: number;
};

type SearchUsersArgs = {
  username: string;
  pageNumber?: number;
  pageSize?: number;
};

type GetUserFeedArgs = {
  pageNumber?: number;
  pageSize?: number;
};

type UsersApiItem = {
  id?: number;
  userId?: number;
  userName?: string;
  username?: string;
  avatarUrl?: string | null;
  avatar?: string | null;
  avatars?: Array<{ url?: string | null }>;
};

type UsersApiResponse = {
  items?: UsersApiItem[];
  users?: UsersApiItem[];
};

const normalizeUser = (user: UsersApiItem): SearchUser | null => {
  const id = user.id ?? user.userId;
  const userName = user.userName ?? user.username;

  if (!id || !userName) {
    return null;
  }

  return {
    id,
    userName,
    avatarUrl: user.avatarUrl ?? user.avatar ?? user.avatars?.[0]?.url ?? null,
  };
};

const getItems = (response: UsersApiResponse | UsersApiItem[]) => {
  if (Array.isArray(response)) {
    return response;
  }

  return response.items ?? response.users ?? [];
};
export const userFollowsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserDetailedProfile: builder.query<UserDetailedProfile, number>({
      query: (userId) => ({
        url: `/api/v1/users/${userId}/profile`,
        method: 'GET',
      }),
      providesTags: (_result, _error, userId) => [
        { type: 'Profile', id: userId },
      ],
    }),
    getUserFollowInfo: builder.query<UserFollowInfo, number>({
      query: (userId) => ({
        url: `/api/v1/users/${userId}/profile`,
        method: 'GET',
      }),
      transformResponse: (response: UserDetailedProfile) => ({
        followersCount: response.followersCount,
        followingCount: response.followingCount,
      }),
      providesTags: (_result, _error, userId) => [
        { type: 'Profile', id: userId },
      ],
    }),
    searchUsers: builder.query<SearchUser[], SearchUsersArgs>({
      query: ({ username, pageNumber = 1, pageSize = 10 }) => ({
        url: '/api/v1/users/search',
        params: {
          username,
          pageNumber,
          pageSize,
        },
      }),
      transformResponse: (response: UsersApiResponse | UsersApiItem[]) =>
        getItems(response).map(normalizeUser).filter(Boolean) as SearchUser[],
    }),
    getUserFeed: builder.query<UserFeedResponse, GetUserFeedArgs | undefined>({
      query: (params) => {
        const { pageNumber = 1, pageSize = 5 } = params || {};

        return {
          url: '/api/v1/users/feed',
          method: 'GET',
          params: {
            pageNumber,
            pageSize,
          },
        };
      },
      providesTags: () => [{ type: 'Posts', id: 'FEED' }],
    }),
    followUser: builder.mutation<
      FollowUserResponse,
      { userId: number; currentUserId: number | null }
    >({
      query: ({ userId }) => ({
        url: `/api/v1/users/${userId}/follow`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { userId, currentUserId }) => [
        { type: 'Profile', id: userId },
        ...(currentUserId
          ? [{ type: 'Profile' as const, id: currentUserId }]
          : []),
      ],
    }),
    unfollowUser: builder.mutation<void, { userId: number }>({
      query: ({ userId }) => ({
        url: `/api/v1/users/${userId}/follow`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: 'Profile', id: userId },
      ],
    }),
  }),
});

export const {
  useGetUserDetailedProfileQuery,
  useGetUserFollowInfoQuery,
  useSearchUsersQuery,
  useGetUserFeedQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
} = userFollowsApi;
