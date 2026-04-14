import {
  GetMyPostsResponse,
  Post,
} from '@/entities/post/model/types/postApi.types';
import { UserProfile } from '@/pages_fsd/profile/modal/types/profileApi.types';

function getBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  if (!baseUrl) throw new Error('NEXT_PUBLIC_BASE_API_URL is not defined');
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
}

export async function fetchUserProfileSSR(
  userId: number,
): Promise<UserProfile | null> {
  const baseUrl = getBaseUrl();
  const url = new URL(`/api/v1/profile/${userId}`, baseUrl);
  const res = await fetch(url.toString(), { cache: 'no-store' });

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
  const baseUrl = getBaseUrl(); // Нужен другой ендпоинт, бэк уже работает над этим
  const url = new URL(`api/v1/posts/${userId}`, baseUrl);

  url.searchParams.set('pageNumber', String(params.pageNumber));
  url.searchParams.set('pageSize', String(params.pageSize));

  if (params.sortBy) url.searchParams.set('sortBy', params.sortBy);
  if (params.sortDirection)
    url.searchParams.set('sortDirection', params.sortDirection);

  const res = await fetch(url.toString(), { cache: 'no-store' });

  if (!res.ok) {
    // throw new Error('Failed to fetch user posts'); Когда появится ендпоинт, надо раскоментить
  }

  return res.json();
}

export async function fetchProfilePostSSR(
  profileId: number,
  postId: string,
): Promise<Post | null> {
  const baseUrl = getBaseUrl();

  const url = new URL(`api/v1/posts/${profileId}`, baseUrl);
  url.searchParams.set('postId', postId);

  const res = await fetch(url.toString(), { cache: 'no-store' });
  console.log('res', res);
  if (res.status === 404) return null;
  if (!res.ok) return null;

  return res.json();
}
