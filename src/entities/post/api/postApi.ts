import { baseApi } from '@/shared/api';
import {
  GetMyPostsRequest,
  GetMyPostsResponse,
  MainPageResponse,
  Post,
} from '@/entities/post/model/types/postApi.types';

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createNewPost: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: '/api/v1/posts',
        method: 'POST',
        body: formData,
      }),
    }),
    deletePost: builder.mutation<void, number>({
      query: (postId) => ({
        url: `/api/v1/posts/${postId}`,
        method: 'DELETE',
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const patchMy = dispatch(
          postsApi.util.updateQueryData('getMyPosts', undefined, (draft) => {
            draft.items = draft.items.filter((p) => p.id !== postId);
            draft.totalCount = Math.max(0, draft.totalCount - 1);
          }),
        );

        const patchMain = dispatch(
          postsApi.util.updateQueryData(
            'getMainPageData',
            { pageSize: 4 },
            (draft) => {
              draft.posts.items = draft.posts.items.filter(
                (p) => p.id !== postId,
              );
              draft.posts.totalCount = Math.max(0, draft.posts.totalCount - 1);
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchMy.undo();
          patchMain.undo();
        }
      },
      invalidatesTags: () => [
        { type: 'Posts', id: 'MY' },
        { type: 'Posts', id: 'MAIN' },
      ],
    }),
    getMainPageData: builder.query<MainPageResponse, { pageSize: number }>({
      query: ({ pageSize }) => ({
        url: '/api/v1',
        params: { pageSize },
      }),
      providesTags: () => [{ type: 'Posts', id: 'MAIN' }],
    }),
    updatePostUser: builder.mutation<
      Post,
      { postId: number; description: string }
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
  }),
});

export const {
  useCreateNewPostMutation,
  useDeletePostMutation,
  useUpdatePostUserMutation,
  useGetMyPostsQuery,
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
  pageSize: number = 4,
): Promise<MainPageResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  const res = await fetch(`${baseUrl}api/v1?pageSize=${pageSize}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch main page data');
  }

  return res.json();
};
