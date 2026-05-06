import { baseApi } from '@/shared/api';
import {
  CommentsResponse,
  GetMyPostsRequest,
  GetMyPostsResponse,
  MainPageResponse,
  Post,
  PostCommentsParams,
  PostLikeMutationResponse,
} from '@/entities/post/model/types/postApi.types';

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
    getProfilePost: builder.query<Post, { profileId: string; postId: string }>({
      query: ({ profileId, postId }) => ({
        url: `/api/v1/posts/${profileId}`,
        params: { postId },
      }),
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
      invalidatesTags: (_result, _error, { postId }) => [
        { type: 'Posts', id: `POST_${postId}` },
        { type: 'Posts', id: 'MAIN' },
        { type: 'Posts', id: 'MY' },
      ],
    }),
    likePost: builder.mutation<PostLikeMutationResponse, { postId: string }>({
      query: ({ postId }) => ({
        url: `/api/v1/posts/${postId}/Like`,
        method: 'POST',
        body: { reaction: 'like' as const },
      }),
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
        { dispatch, queryFulfilled },
      ) {
        const patchResult = dispatch(
          postsApi.util.updateQueryData(
            'getPostComments',
            { postId, pageNumber: 1, pageSize: 20 },
            (draft) => {
              const comment = draft.items.find((c) => c.id === commentId);
              if (comment) {
                const wasLiked = comment.userReaction === 'like';
                const isLikeAction = reaction === 'like';

                comment.userReaction = reaction;

                comment.likeCount += isLikeAction ? 1 : -1;

                if (wasLiked && !isLikeAction) {
                  comment.dislikeCount = Math.max(0, comment.dislikeCount);
                }
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, { postId, commentId }) => [
        { type: 'PostComments', id: `POST_${postId}` },
        { type: 'PostComments', id: `COMMENT_${commentId}` },
      ],
    }),
    unlikePost: builder.mutation<PostLikeMutationResponse, { postId: string }>({
      query: ({ postId }) => ({
        url: `/api/v1/posts/${postId}/Like`,
        method: 'POST',
        body: { reaction: 'none' as const },
      }),
    }),
    getPostComments: builder.query<CommentsResponse, PostCommentsParams>({
      query: ({
        postId,
        pageNumber = 1,
        pageSize = 20,
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
              ...result.items.map(({ id }) => ({
                type: 'PostComments' as const,
                id: `COMMENT_${id}` as const,
              })),
            ]
          : [{ type: 'PostComments', id: 'LIST' }],
    }),
  }),
});

export const {
  useCreateNewPostMutation,
  useDeletePostMutation,
  useGetMainPageDataQuery,
  useLazyGetMainPageDataQuery,
  useUpdatePostUserMutation,
  useGetUserPostsQuery,
  useGetProfilePostQuery,
  useGetMyPostsQuery,
  useAddCommentMutation,
  useLikePostMutation,
  useUnlikePostMutation,
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
