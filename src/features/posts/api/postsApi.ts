import { baseApi } from '@/shared/api/baseApi';
import {
  GetMyPostsRequest,
  GetMyPostsResponse,
} from '@/features/posts/api/postsApi.types';

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyPosts: builder.query<GetMyPostsResponse, GetMyPostsRequest | void>({
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

export const { useGetMyPostsQuery, useLazyGetMyPostsQuery } = postsApi;

