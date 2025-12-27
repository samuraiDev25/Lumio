import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';

const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');

    headers.set('Authorization', `Bearer ${token}`);

    return headers;
  },
  credentials: 'include',
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock(); // Проверка заблокирован ли Mutex другим потоком
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = (await baseQuery(
          {
            url: '/api/v1/auth/update-tokens',
            method: 'POST',
          },
          api,
          extraOptions,
          // eslint-disable-next-line
        )) as any;

        if (refreshResult.data) {
          localStorage.setItem('token', refreshResult.data.accessToken);
          // retry the initial query
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
