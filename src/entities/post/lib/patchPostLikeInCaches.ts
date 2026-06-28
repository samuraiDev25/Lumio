import type { AppDispatch, RootState } from '@/app/store';
import { postsApi } from '@/entities/post/api/postApi';
import { userFollowsApi } from '@/entities/user/api/userFollowsApi';
import type {
  GetMyPostsRequest,
  Reaction,
} from '@/entities/post/model/types/postApi.types';
import { baseApi } from '@/shared/api/baseApi';

type QueryCacheEntry = {
  status: string;
  data?: unknown;
};

export type PostLikePatch = {
  likeCount: number;
  userReaction: Reaction;
};

type ReactionPost = {
  id: string;
  likeCount?: number;
  userReaction?: Reaction;
};

type FeedReactionPost = {
  id: string;
  likesCount?: number;
  isLiked?: boolean;
};

function applyLikeToPost(
  draft: ReactionPost | null | undefined,
  postId: string,
  patch: PostLikePatch,
) {
  if (!draft || draft.id !== postId) return;
  if (draft.likeCount === undefined || draft.userReaction === undefined) return;

  draft.likeCount = patch.likeCount;
  draft.userReaction = patch.userReaction;
}

function applyLikeToFeedPost(
  draft: FeedReactionPost | null | undefined,
  postId: string,
  patch: PostLikePatch,
) {
  if (!draft || draft.id !== postId) return;
  if (draft.likesCount === undefined || draft.isLiked === undefined) return;

  draft.likesCount = patch.likeCount;
  draft.isLiked = patch.userReaction === 'like';
}

function parseGetMyPostsArgs(json: string): GetMyPostsRequest | undefined {
  if (json === 'undefined') return undefined;
  return JSON.parse(json) as GetMyPostsRequest;
}

function getApiQueries(
  state: RootState,
): Record<string, QueryCacheEntry> | undefined {
  const slice = state[baseApi.reducerPath as keyof RootState] as
    | { queries?: Record<string, QueryCacheEntry> }
    | undefined;
  return slice?.queries;
}

export function patchPostLikeInCaches(
  dispatch: AppDispatch,
  state: RootState,
  postId: string,
  patch: PostLikePatch,
) {
  const queries = getApiQueries(state);
  if (!queries) return;

  for (const cacheKey of Object.keys(queries)) {
    if (cacheKey.startsWith('getUserFeed(')) {
      const json = cacheKey.slice('getUserFeed('.length, -1);
      let args: { pageNumber?: number; pageSize?: number } | undefined;
      try {
        args = json === 'undefined' ? undefined : JSON.parse(json);
      } catch {
        continue;
      }
      dispatch(
        userFollowsApi.util.updateQueryData('getUserFeed', args, (draft) => {
          const item = draft.items?.find((p) => p.id === postId);
          applyLikeToFeedPost(item, postId, patch);
        }),
      );
      continue;
    }

    if (cacheKey.startsWith('getMainPageData(')) {
      const json = cacheKey.slice('getMainPageData('.length, -1);
      let args: { pageNumber?: number; pageSize: number };
      try {
        args = JSON.parse(json);
      } catch {
        continue;
      }
      dispatch(
        postsApi.util.updateQueryData('getMainPageData', args, (draft) => {
          const item = draft.posts?.items?.find((p) => p.id === postId);
          applyLikeToPost(item, postId, patch);
        }),
      );
      continue;
    }

    if (cacheKey.startsWith('getUserPosts(')) {
      const json = cacheKey.slice('getUserPosts('.length, -1);
      let args: {
        userId: string;
        pageNumber?: number;
        pageSize?: number;
        sortBy?: string;
        sortDirection?: 'asc' | 'desc';
      };
      try {
        args = JSON.parse(json);
      } catch {
        continue;
      }
      dispatch(
        postsApi.util.updateQueryData('getUserPosts', args, (draft) => {
          const item = draft.items?.find((p) => p.id === postId);
          applyLikeToPost(item, postId, patch);
        }),
      );
      continue;
    }

    if (cacheKey.startsWith('getMyPosts(')) {
      const json = cacheKey.slice('getMyPosts('.length, -1);
      let args: GetMyPostsRequest | undefined;
      try {
        args = parseGetMyPostsArgs(json);
      } catch {
        continue;
      }
      dispatch(
        postsApi.util.updateQueryData('getMyPosts', args, (draft) => {
          const item = draft.items?.find((p) => p.id === postId);
          applyLikeToPost(item, postId, patch);
        }),
      );
      continue;
    }

    if (cacheKey.startsWith('getProfilePost(')) {
      const json = cacheKey.slice('getProfilePost('.length, -1);
      let args: { profileId: string; postId: string };
      try {
        args = JSON.parse(json);
      } catch {
        continue;
      }
      if (String(args.postId) !== String(postId)) continue;
      dispatch(
        postsApi.util.updateQueryData('getProfilePost', args, (draft) => {
          applyLikeToPost(draft, postId, patch);
        }),
      );
    }
  }
}
