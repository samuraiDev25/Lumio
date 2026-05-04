import type { AppDispatch, RootState } from '@/app/store';
import { postsApi } from '@/entities/post/api/postApi';
import type {
  GetMyPostsRequest,
  GetMyPostsResponse,
  MainPageResponse,
  Post,
} from '@/entities/post/model/types/postApi.types';
import { baseApi } from '@/shared/api/baseApi';

type QueryCacheEntry = {
  status: string;
  data?: unknown;
};

export type PostLikePatch = {
  likesCount: number;
  isLiked: boolean;
};

function applyLikeToPost(
  draft: Post | undefined,
  postId: string,
  patch: PostLikePatch,
) {
  if (!draft || draft.id !== postId) return;
  draft.likesCount = patch.likesCount;
  draft.isLiked = patch.isLiked;
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

export function findPostInCaches(
  state: RootState,
  postId: string,
): Post | null {
  const queries = getApiQueries(state);
  if (!queries) return null;

  for (const cacheKey of Object.keys(queries)) {
    const entry = queries[cacheKey];
    if (!entry || entry.status !== 'fulfilled' || entry.data === undefined) {
      continue;
    }

    if (cacheKey.startsWith('getMainPageData(')) {
      const main = entry.data as MainPageResponse;
      const item = main.posts?.items?.find((p) => p.id === postId);
      if (item) return item;
      continue;
    }

    if (
      cacheKey.startsWith('getUserPosts(') ||
      cacheKey.startsWith('getMyPosts(')
    ) {
      const list = entry.data as GetMyPostsResponse;
      const item = list.items?.find((p) => p.id === postId);
      if (item) return item;
      continue;
    }

    if (cacheKey.startsWith('getProfilePost(')) {
      const post = entry.data as Post;
      if (post.id === postId) return post;
    }
  }

  return null;
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
