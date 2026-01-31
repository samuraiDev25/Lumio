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
 * Функция для серверного получения данных (ISR).
 * Используем чистый fetch, так как RTK Query на сервере в Next.js 13+
 * не поддерживает нативный кэш { next: { revalidate } } так эффективно, как fetch.
 */
export const fetchMainPageData = async (
  pageSize: number = 4,
): Promise<MainPageResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  const res = await fetch(`${baseUrl}api/v1?pageSize=${pageSize}`, {
    next: { revalidate: 60 }, // ISR: обновляем контент раз в минуту
  });

  if (!res.ok) {
    throw new Error('Failed to fetch main page data');
  }

  return res.json();
};
