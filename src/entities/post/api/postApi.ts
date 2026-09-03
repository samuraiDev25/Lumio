import { baseApi } from '@/shared/api';
import {
  CommentsResponse,
  Comment,
  GetMyPostsRequest,
  GetMyPostsResponse,
  MainPageResponse,
  Post,
  PostCommentsParams,
  PostWithReaction,
  Reaction,
  UpdatePostReactionRequest,
} from '@/entities/post/model/types/postApi.types';

type QueryCacheEntry = {
  status: string;
  data?: unknown;
};

type CommentReactionSnapshot = {
  args: PostCommentsParams;
  likeCount: number;
  dislikeCount: number;
  userReaction: Reaction;
};

function getApiQueries(state: unknown): Record<string, QueryCacheEntry> {
  const apiState = state as Record<
    string,
    { queries?: Record<string, QueryCacheEntry> }
  >;

  return apiState[baseApi.reducerPath]?.queries ?? {};
}

function parseEndpointArgs<T>(
  cacheKey: string,
  endpointName: string,
): T | null {
  if (!cacheKey.startsWith(`${endpointName}(`)) return null;

  try {
    return JSON.parse(cacheKey.slice(endpointName.length + 1, -1)) as T;
  } catch {
    return null;
  }
}

function getPostCommentsCacheArgs(
  state: unknown,
  postId: string,
): PostCommentsParams[] {
  return Object.keys(getApiQueries(state))
    .map((cacheKey) =>
      parseEndpointArgs<PostCommentsParams>(cacheKey, 'getPostComments'),
    )
    .filter((args): args is PostCommentsParams => args?.postId === postId);
}

function findComment(comments: Comment[], commentId: number): Comment | null {
  for (const comment of comments) {
    if (comment.id === commentId) return comment;

    const reply = findComment(comment.replies, commentId);
    if (reply) return reply;
  }

  return null;
}

function getCommentTags(
  comments: Comment[],
): Array<{ type: 'PostComments'; id: string }> {
  return comments.flatMap((comment) => [
    {
      type: 'PostComments' as const,
      id: `COMMENT_${comment.id}` as const,
    },
    ...getCommentTags(comment.replies),
  ]);
}

function applyCommentReaction(
  comment: Comment,
  reaction: 'like' | 'none' | 'dislike',
) {
  const previousReaction = comment.userReaction;

  if (previousReaction === reaction) return;

  if (previousReaction === 'like') {
    comment.likeCount = Math.max(0, comment.likeCount - 1);
  }

  if (previousReaction === 'dislike') {
    comment.dislikeCount = Math.max(0, comment.dislikeCount - 1);
  }

  if (reaction === 'like') {
    comment.likeCount += 1;
  }

  if (reaction === 'dislike') {
    comment.dislikeCount += 1;
  }

  comment.userReaction = reaction;
}

function appendComment(
  comments: Comment[],
  comment: Comment,
  parentCommentId?: number,
) {
  const commentWithReplies = {
    ...comment,
    replies: comment.replies ?? [],
  };

  if (!parentCommentId) {
    comments.unshift(commentWithReplies);
    return true;
  }

  const parent = findComment(comments, parentCommentId);
  if (!parent) return false;

  parent.replies.unshift(commentWithReplies);
  return true;
}

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createNewPost: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: '/api/v1/posts',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: () => [
        { type: 'Posts', id: 'MY' },
        { type: 'Posts', id: 'MAIN' },
      ],
    }),
    deletePost: builder.mutation<void, string>({
      query: (postId) => ({
        url: `/api/v1/posts/${postId}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [
        { type: 'Posts', id: 'MY' },
        { type: 'Posts', id: 'MAIN' },
      ],
    }),
    getMainPageData: builder.query<
      MainPageResponse,
      { pageNumber?: number; pageSize: number }
    >({
      query: ({ pageNumber = 1, pageSize }) => ({
        url: '/api/v1',
        params: { pageNumber, pageSize },
      }),
      providesTags: () => [{ type: 'Posts', id: 'MAIN' }],
    }),
    getPostById: builder.query<PostWithReaction, string>({
      query: (postId) => ({
        url: `/api/v1/posts/post/${postId}`,
      }),
      providesTags: (_result, _error, postId) => [
        { type: 'Posts', id: `POST_${postId}` },
      ],
    }),
    updatePostUser: builder.mutation<
      Post,
      { postId: string; description: string }
    >({
      query: ({ postId, description }) => ({
        url: `/api/v1/posts/${postId}`,
        method: 'PUT',
        body: { description },
      }),
      async onQueryStarted(
        { postId, description },
        { dispatch, queryFulfilled },
      ) {
        // Оптимистичное обновление
        const patchMy = dispatch(
          postsApi.util.updateQueryData('getMyPosts', undefined, (state) => {
            const post = state.items.find((p) => p.id === postId);
            if (post) {
              post.description = description;
            }
          }),
        );
        try {
          await queryFulfilled;
          const { revalidateMainPagePosts } = await import('@/app/actions');
          await revalidateMainPagePosts();
        } catch {
          patchMy.undo();
        }
      },
      invalidatesTags: ['Posts'],
    }),
    getMyPosts: builder.query<
      GetMyPostsResponse,
      GetMyPostsRequest | undefined
    >({
      query: (params) => {
        const {
          pageNumber = 1,
          pageSize = 8,
          sortBy,
          sortDirection,
        } = params || {};

        return {
          url: `/api/v1/posts/my`,
          params: {
            pageNumber,
            pageSize,
            ...(sortBy && { sortBy }),
            ...(sortDirection && { sortDirection }),
          },
        };
      },
      providesTags: () => [{ type: 'Posts', id: 'MY' }],
    }),
    getProfilePost: builder.query<
      PostWithReaction | null,
      { profileId: string; postId: string }
    >({
      query: ({ profileId, postId }) => ({
        url: `/api/v1/posts/${profileId}`,
        params: { postId },
      }),
      transformResponse: (response: GetMyPostsResponse, _meta, { postId }) =>
        response.items.find((post) => post.id === postId) ?? null,
      providesTags: (_res, _err, arg) => [
        { type: 'Posts', id: `PROFILE_${arg.profileId}_${arg.postId}` },
      ],
    }),
    getUserPosts: builder.query<
      GetMyPostsResponse,
      {
        userId: string;
        pageNumber?: number;
        pageSize?: number;
        sortBy?: string;
        sortDirection?: 'asc' | 'desc';
      }
    >({
      query: ({
        userId,
        pageNumber = 1,
        pageSize = 8,
        sortBy,
        sortDirection,
      }) => ({
        url: `/api/v1/posts/${userId}`,
        params: {
          pageNumber,
          pageSize,
          ...(sortBy && { sortBy }),
          ...(sortDirection && { sortDirection }),
        },
      }),
      providesTags: (_result, _error, arg) => [
        { type: 'Posts', id: `USER_${arg.userId}` },
      ],
    }),
    addComment: builder.mutation<
      Comment,
      { postId: string; content: string; parentCommentId?: number }
    >({
      query: ({ postId, content, parentCommentId }) => ({
        method: 'POST',
        url: `/api/v1/posts/${postId}/comments`,
        body: { content, parentCommentId },
      }),
      async onQueryStarted(
        { postId, parentCommentId },
        { dispatch, getState, queryFulfilled },
      ) {
        try {
          const { data: comment } = await queryFulfilled;
          const patchResults = getPostCommentsCacheArgs(getState(), postId).map(
            (args) =>
              dispatch(
                postsApi.util.updateQueryData(
                  'getPostComments',
                  args,
                  (draft) => {
                    if (appendComment(draft.items, comment, parentCommentId)) {
                      draft.totalCount += 1;
                    }
                  },
                ),
              ),
          );

          if (patchResults.length === 0) {
            return;
          }
        } catch {
          // The form handles the visible error state.
        }
      },
      invalidatesTags: (_result, _error, { postId }) => [
        { type: 'Posts', id: `POST_${postId}` },
        { type: 'Posts', id: 'MAIN' },
        { type: 'Posts', id: 'MY' },
        { type: 'PostComments', id: `POST_${postId}` },
      ],
    }),
    updatePostReaction: builder.mutation<void, UpdatePostReactionRequest>({
      query: ({ postId, status }) => ({
        url: `/api/v1/posts/${postId}/like`,
        method: 'POST',
        body: { status },
      }),
      invalidatesTags: (_result, error, { postId }) =>
        error ? [] : [{ type: 'Posts', id: `POST_${postId}` }],
    }),
    likeComment: builder.mutation<
      void,
      {
        postId: string;
        commentId: number;
        reaction: 'like' | 'none' | 'dislike';
      }
    >({
      query: ({ commentId, reaction }) => ({
        url: `/api/v1/posts/comments/${commentId}/like`,
        method: 'POST',
        body: { status: reaction },
      }),
      async onQueryStarted(
        { postId, commentId, reaction },
        { dispatch, getState, queryFulfilled },
      ) {
        const snapshots: CommentReactionSnapshot[] = [];
        const cacheArgs = getPostCommentsCacheArgs(getState(), postId);

        cacheArgs.forEach((args) => {
          dispatch(
            postsApi.util.updateQueryData('getPostComments', args, (draft) => {
              const comment = findComment(draft.items, commentId);

              if (!comment) return;

              snapshots.push({
                args,
                likeCount: comment.likeCount,
                dislikeCount: comment.dislikeCount,
                userReaction: comment.userReaction,
              });
              applyCommentReaction(comment, reaction);
            }),
          );
        });

        try {
          await queryFulfilled;
        } catch {
          snapshots.forEach((snapshot) => {
            dispatch(
              postsApi.util.updateQueryData(
                'getPostComments',
                snapshot.args,
                (draft) => {
                  const comment = findComment(draft.items, commentId);

                  if (!comment) return;

                  comment.likeCount = snapshot.likeCount;
                  comment.dislikeCount = snapshot.dislikeCount;
                  comment.userReaction = snapshot.userReaction;
                },
              ),
            );
          });
        }
      },
      invalidatesTags: (_result, error, { postId, commentId }) =>
        error
          ? []
          : [
              { type: 'PostComments', id: `POST_${postId}` },
              { type: 'PostComments', id: `COMMENT_${commentId}` },
            ],
    }),
    getPostComments: builder.query<CommentsResponse, PostCommentsParams>({
      query: ({
        postId,
        pageNumber = 1,
        pageSize = 5,
        sortBy,
        sortDirection,
      }) => ({
        url: `/api/v1/posts/${postId}/comments`,
        params: {
          pageNumber,
          pageSize,
          ...(sortBy && { sortBy }),
          ...(sortDirection && { sortDirection }),
        },
      }),
      providesTags: (result, error, arg) =>
        result
          ? [
              { type: 'PostComments', id: `POST_${arg.postId || 'LIST'}` },
              ...getCommentTags(result.items),
            ]
          : [{ type: 'PostComments', id: 'LIST' }],
    }),
  }),
  overrideExisting: process.env.NODE_ENV === 'development',
});

export const {
  useCreateNewPostMutation,
  useDeletePostMutation,
  useGetMainPageDataQuery,
  useLazyGetMainPageDataQuery,
  useGetPostByIdQuery,
  useUpdatePostUserMutation,
  useGetUserPostsQuery,
  useLazyGetUserPostsQuery,
  useGetProfilePostQuery,
  useGetMyPostsQuery,
  useAddCommentMutation,
  useUpdatePostReactionMutation,
  useGetPostCommentsQuery,
  useLikeCommentMutation,
} = postsApi;

/**
 * Server-side function for data fetching (ISR).
 *
 * Note: We use native 'fetch' here because RTK Query in Next.js Server Components
 * does not support the native cache configuration { next: { revalidate } }
 * as effectively as the built-in fetch API.
 *
 * @param pageSize - Number of posts to fetch (default: 4).
 * @returns Promise with MainPageResponse data.
 */
export const fetchMainPageData = async (
  pageNumber: number = 1,
  pageSize: number = 4,
): Promise<MainPageResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  const res = await fetch(
    `${baseUrl}api/v1?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    {
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) {
    throw new Error('Failed to fetch main page data');
  }

  return res.json();
};
