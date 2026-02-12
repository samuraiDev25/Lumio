import { baseApi } from '@/shared/api';
import { postApi } from '@/features/posts/api/postApi';

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
          postApi.util.updateQueryData('getMyPosts', undefined, (draft) => {
            draft.items = draft.items.filter((p) => p.id !== postId);
            draft.totalCount = Math.max(0, draft.totalCount - 1);
          }),
        );

        const patchMain = dispatch(
          postApi.util.updateQueryData(
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
  }),
});

export const { useCreateNewPostMutation, useDeletePostMutation } = postsApi;
