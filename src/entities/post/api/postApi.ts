import { baseApi } from '@/shared/api';

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createNewPost: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: '/api/v1/posts',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useCreateNewPostMutation } = postsApi;
