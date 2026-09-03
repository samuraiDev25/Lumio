export type ChatSocketNamespace = '/';

export type ChatSocketTransport = 'websocket' | 'polling';

export type ChatSocketConfig = {
  productionUrl: 'wss://lumio.su';
  namespace: ChatSocketNamespace;
  transports: ChatSocketTransport[];
};

export type ChatConnectionEstablishedPayload = {
  userId: number;
};

export type MessageAttachmentType = 'IMAGE' | 'VOICE';
export type ChatMessageType = 'TEXT' | MessageAttachmentType;
export type ChatMessageStatus = 'SENT' | 'DELIVERED' | 'READ';

export type ChatMessageAttachment = {
  id: string;
  type: MessageAttachmentType;
  url: string;
  mimeType: string;
  size: number;
  duration?: number;
  width?: number;
  height?: number;
  createdAt?: string;
};

export type BaseChatMessage = {
  id: string;
  chatId: number;
  senderId: number;
  content: string | null;
  type: ChatMessageType;
  status: ChatMessageStatus;
  readAt: string | null;
  createdAt: string;
  attachments: ChatMessageAttachment[];
};

export type TextChatMessage = BaseChatMessage;

export type ChatSocketMessagePayload = {
  messageId: string;
  chatId: number;
  senderId?: number;
  content: string | null;
  createdAt: string;
  type?: ChatMessageType;
  status?: ChatMessageStatus;
  readAt?: string | null;
  attachments?: ChatMessageAttachment[];
  attachment?: ChatMessageAttachment;
};

export type ChatMessageReadPayload = {
  messageId: string;
  chatId: number;
  readerId: number;
  readAt: string;
};

export type ChatUserTypingPayload = {
  userId: number;
  chatId: number;
  isTyping: boolean;
};

export type ChatSocketErrorPayload = {
  message: string;
};

export type SendTypingStopPayload = {
  chatId: number;
};

export type SendMessageRequest = {
  recipientId: number;
  message: string;
};

// Сервис возвращает саму запись сообщения с полем `id`, а не `messageId`,
// как в событиях сокета. Вложения приходят только у медиа-сообщений.
export type SendMessageResponse = Omit<BaseChatMessage, 'attachments'> & {
  attachments?: ChatMessageAttachment[];
};

export type GetChatMessagesRequest = {
  recipientId: number;
  cursor?: string;
  limit?: number;
};

export type GetChatMessagesResponse = {
  items: BaseChatMessage[];
  nextCursor: string | null;
  totalCount: number;
  limit: number;
  currentCursor: string | null;
};

export type MarkMessageAsReadResponse = {
  success: boolean;
};
