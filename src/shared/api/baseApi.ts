import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQueryWithReAuth';

export const baseApi = createApi({
  reducerPath: 'lumioApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Me'],
  endpoints: () => ({}),
});

export type baseApi = typeof baseApi;
