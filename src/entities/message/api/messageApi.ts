import { baseApi } from '@/shared/api';
import type {
  GetChatMessagesRequest,
  GetChatMessagesResponse,
  MarkMessageAsReadResponse,
  SendMessageRequest,
  SendMessageResponse,
} from '@/entities/message/model/types';

const CHAT_API_URL =
  process.env.NEXT_PUBLIC_CHAT_API_URL ?? 'https://lumio.su/api/v1';

export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChatMessages: builder.query<
      GetChatMessagesResponse,
      GetChatMessagesRequest
    >({
      query: ({ recipientId, cursor, limit = 20 }) => ({
        url: `${CHAT_API_URL}/chats/messages`,
        method: 'GET',
        params: {
          recipientId,
          cursor,
          limit,
        },
      }),
      providesTags: (_result, _error, { recipientId }) => [
        { type: 'ChatMessages', id: recipientId },
      ],
    }),
    sendMessage: builder.mutation<SendMessageResponse, SendMessageRequest>({
      query: (body) => ({
        url: `${CHAT_API_URL}/chats/send-message`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { recipientId }) => [
        { type: 'ChatMessages', id: recipientId },
      ],
    }),
    markMessageAsRead: builder.mutation<MarkMessageAsReadResponse, string>({
      query: (messageId) => ({
        url: `${CHAT_API_URL}/chats/messages/${messageId}/read`,
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: process.env.NODE_ENV === 'development',
});

export const {
  useGetChatMessagesQuery,
  useLazyGetChatMessagesQuery,
  useMarkMessageAsReadMutation,
  useSendMessageMutation,
} = messageApi;
