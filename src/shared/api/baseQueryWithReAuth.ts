import { Mutex } from 'async-mutex';
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { jwtDecode } from 'jwt-decode';
import { clearAuthData } from '@/features/auth/api/authUtils';
import { logout } from '@/features/auth/model/authSlice';
import { APP_ROUTES } from '@/shared/lib/routes';

const mutex = new Mutex();

const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

// С токеном — для обычных запросов
const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include',
});

// Без токена — только для рефреша
const baseQueryWithoutAuth = fetchBaseQuery({
  baseUrl,
  credentials: 'include',
});

const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const decoded: { exp?: number } = jwtDecode(token);
    if (!decoded.exp) return true;
    return decoded.exp < Date.now() / 1000 + 10;
  } catch {
    return true;
  }
};

const isAuthUrl = (args: string | FetchArgs): boolean => {
  const url = typeof args === 'string' ? args : args.url;
  return (
    url.includes('/api/v1/auth/refresh-token') ||
    url.includes('/api/v1/auth/login') ||
    url.includes('/api/v1/auth/logout')
  );
};

const handleUnauthorized = (api: { dispatch: (action: unknown) => void }) => {
  clearAuthData();
  api.dispatch(logout());
  if (typeof window !== 'undefined') {
    window.location.replace(APP_ROUTES.ROOT);
  }
};

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  if (!isAuthUrl(args)) {
    const token = localStorage.getItem('accessToken');

    // Только если токен есть но истёк — не трогаем если токена нет вообще
    if (token && isTokenExpired(token)) {
      if (mutex.isLocked()) {
        await mutex.waitForUnlock();
      } else {
        const release = await mutex.acquire();
        try {
          // Double-check после захвата mutex
          if (isTokenExpired(localStorage.getItem('accessToken'))) {
            const refreshResult = await baseQueryWithoutAuth(
              { url: '/api/v1/auth/refresh-token', method: 'POST' },
              api,
              extraOptions,
            );
            if (refreshResult.data) {
              const data = refreshResult.data as { accessToken?: string };
              if (data?.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
              } else {
                handleUnauthorized(api);
              }
            } else {
              handleUnauthorized(api);
            }
          }
        } finally {
          release();
        }
      }
    }
  }

  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  // Реактивная обработка — если всё равно получили 401
  if (result.error && result.error.status === 401 && !isAuthUrl(args)) {
    if (mutex.isLocked()) {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    } else {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQueryWithoutAuth(
          { url: '/api/v1/auth/refresh-token', method: 'POST' },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          const data = refreshResult.data as { accessToken?: string };
          if (data?.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
            // Повторяем оригинальный запрос один раз
            result = await baseQuery(args, api, extraOptions);
          } else {
            handleUnauthorized(api);
          }
        } else {
          // Рефреш не удался — чистим токен, редирект через middleware
          handleUnauthorized(api);
        }
      } finally {
        release();
      }
    }
  }

  return result;
};
