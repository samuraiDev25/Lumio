import { MainPageResponse } from '@/features/posts/api/postApi.types';
import { baseApi } from '@/shared/api';

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMainPageData: builder.query<MainPageResponse, { pageSize: number }>({
      query: ({ pageSize }) => ({
        url: '/api/v1',
        params: { pageSize },
      }),
    }),
  }),
});

export const { useGetMainPageDataQuery } = postApi;

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
