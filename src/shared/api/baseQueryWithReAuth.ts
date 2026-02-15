import { Mutex } from 'async-mutex';
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken');
    // Без этой проверки при token = null отправлялось бы "Bearer null"
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    // headers.set('Content-Type', 'multipart/form-data');
    return headers;
  },
  credentials: 'include',
});
const isAuthUrl = (args: string | FetchArgs) => {
  const url = typeof args === 'string' ? args : args.url;

  return (
    url.includes('/api/v1/auth/refresh-token') ||
    url.includes('/api/v1/auth/login') ||
    url.includes('/api/v1/auth/logout')
  );
};

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock(); // Проверка заблокирован ли Mutex другим потоком
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (isAuthUrl(args)) return result;

    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = (await baseQuery(
          {
            url: '/api/v1/auth/refresh-token',
            method: 'POST',
          },
          api,
          extraOptions,
          // eslint-disable-next-line
        )) as any;
        if (refreshResult.error) return result;
        const data = refreshResult.data as { accessToken?: string } | undefined;
        if (data?.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
          result = await baseQuery(args, api, extraOptions);
        }

        if (refreshResult.data) {
          localStorage.setItem('accessToken', refreshResult.data.accessToken);
          // retry the initial query
          console.log(refreshResult);
          result = await baseQuery(args, api, extraOptions);
        } else {
          return {
            error: { status: 401, data: { error: 'Refresh token failed' } },
          };
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
