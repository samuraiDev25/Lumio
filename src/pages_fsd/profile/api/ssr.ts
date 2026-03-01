import { GetMyPostsResponse } from '@/entities/post/model/types/postApi.types';
import { UserProfile } from '@/pages_fsd/profile/modal/types/profile.types';

export async function fetchUserProfileSSR(
  userId: number,
): Promise<UserProfile | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  const res = await fetch(`${baseUrl}api/v1/profile/${userId}`, {
    // SSR fetch
    cache: 'no-store',
  });

  if (res.status === 404) return null;

  return res.json();
}

export async function fetchUserPostsSSR(
  userId: number,
  params: {
    pageNumber: number;
    pageSize: number;
    sortBy?: string;
    sortDirection?: string;
  },
): Promise<GetMyPostsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  const url = new URL(`${baseUrl}api/v1/posts/${userId}`); // Нужен другой ендпоинт, бэк уже работает над этим

  url.searchParams.set('pageNumber', String(params.pageNumber));
  url.searchParams.set('pageSize', String(params.pageSize));

  if (params.sortBy) url.searchParams.set('sortBy', params.sortBy);
  if (params.sortDirection)
    url.searchParams.set('sortDirection', params.sortDirection);

  const res = await fetch(url.toString(), {
    cache: 'no-store',
  });

  if (!res.ok) {
    // throw new Error('Failed to fetch user posts'); Когда появится ендпоинт, надо раскоментить
  }

  return res.json();
}
