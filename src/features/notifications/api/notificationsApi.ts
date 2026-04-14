import { baseApi } from '@/shared/api/baseApi';
import { io, Socket } from 'socket.io-client';
import {
  GetNotificationsResponse,
  UnreadCountResponse,
  GetHistoryParams,
} from '../model/notificationsTypes';

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationsHistory: builder.query<
      GetNotificationsResponse,
      GetHistoryParams
    >({
      query: (params) => ({
        url: '/api/v1/notifications/history',
        method: 'GET',
        params,
      }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newItems) => {
        if (newItems.page === 1) {
          return newItems;
        }
        currentCache.items.push(...newItems.items);
        currentCache.page = newItems.page;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      providesTags: ['Notifications'],
    }),

    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => '/api/v1/notifications/unread-count',
      providesTags: ['Notifications'],

      async onCacheEntryAdded(
        _,
        { cacheDataLoaded, cacheEntryRemoved, dispatch },
      ) {
        let socket: Socket | null = null;

        try {
          await cacheDataLoaded;
          const token = localStorage.getItem('accessToken');
          socket = io('wss://lumio.su/notifications', {
            auth: { token },
          });
          socket.on('notification:new', () => {
            dispatch(notificationsApi.util.invalidateTags(['Notifications']));
          });
        } catch (e) {
          console.error('Socket connection failed', e);
        }

        await cacheEntryRemoved;
        socket?.disconnect();
      },
    }),

    markAsRead: builder.mutation<void, { notificationIds: string[] }>({
      query: (body) => ({
        url: '/api/v1/notifications/mark-read',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetNotificationsHistoryQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
} = notificationsApi;
