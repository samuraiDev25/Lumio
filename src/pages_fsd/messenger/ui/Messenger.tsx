'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SearchUser } from '@/entities/user';
import { useSearchUsersQuery } from '@/entities/user';
import { useMeQuery } from '@/features/auth/api/authApi';
import {
  BaseChatMessage,
  ChatMessageReadPayload,
  ChatSocketMessagePayload,
  ChatUserTypingPayload,
  SendMessageResponse,
  useGetChatMessagesQuery,
  useLazyGetChatMessagesQuery,
  useMarkMessageAsReadMutation,
  useSendMessageMutation,
} from '@/entities/message';
import { SendMessageForm } from '@/features/messenger/send-message';
import { useChatSocket } from '@/features/messenger';
import { Button, TextField, Typography } from '@/shared/ui';
import { DoneAllOutline, MessageCircleOutline } from '@/shared/ui/icons';
import { Loading } from '@/shared/ui/loading/Loading';
import s from './Messenger.module.scss';

const SEARCH_MIN_LENGTH = 3;
const MESSAGES_LIMIT = 20;
const MAX_STORED_CHATS = 50;
const CHAT_USERS_STORAGE_PREFIX = 'lumio:messenger:users';

const parseStoredChatUsers = (value: string | null): SearchUser[] => {
  if (!value) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);

    return Array.isArray(parsed)
      ? parsed.filter(
          (user): user is SearchUser =>
            typeof user === 'object' &&
            user !== null &&
            typeof user.id === 'number' &&
            typeof user.userName === 'string' &&
            (typeof user.avatarUrl === 'string' || user.avatarUrl === null),
        )
      : [];
  } catch {
    return [];
  }
};

const getInitials = (userName: string) => userName.slice(0, 2).toUpperCase();

type UserAvatarProps = {
  user: SearchUser;
};

function UserAvatar({ user }: UserAvatarProps) {
  return (
    <span
      className={`${s.avatar} ${user.avatarUrl ? s['avatar-image'] : ''}`}
      style={
        user.avatarUrl
          ? { backgroundImage: `url(${user.avatarUrl})` }
          : undefined
      }
    >
      {!user.avatarUrl && getInitials(user.userName)}
    </span>
  );
}

const formatMessageTime = (date: Date) =>
  date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

const sortMessagesByDate = (messages: BaseChatMessage[]) =>
  [...messages].sort(
    (firstMessage, secondMessage) =>
      new Date(firstMessage.createdAt).getTime() -
      new Date(secondMessage.createdAt).getTime(),
  );

const mergeMessage = (
  messages: BaseChatMessage[],
  incomingMessage: BaseChatMessage,
) => {
  const existingIndex = messages.findIndex(
    (message) => message.id === incomingMessage.id,
  );

  if (existingIndex === -1) {
    return sortMessagesByDate([...messages, incomingMessage]);
  }

  const updatedMessages = [...messages];
  updatedMessages[existingIndex] = {
    ...updatedMessages[existingIndex],
    ...incomingMessage,
  };

  return sortMessagesByDate(updatedMessages);
};

const mergeMessages = (
  currentMessages: BaseChatMessage[],
  incomingMessages: BaseChatMessage[],
) =>
  incomingMessages.reduce(
    (messages, message) => mergeMessage(messages, message),
    currentMessages,
  );

const mapSocketMessage = (
  payload: ChatSocketMessagePayload,
  fallbackSenderId: number | null,
): BaseChatMessage => ({
  id: payload.messageId,
  chatId: payload.chatId,
  senderId: payload.senderId ?? fallbackSenderId ?? 0,
  content: payload.content,
  type: payload.type ?? 'TEXT',
  status: payload.status ?? 'SENT',
  readAt: payload.readAt ?? null,
  createdAt: payload.createdAt,
  attachments:
    payload.attachments ?? (payload.attachment ? [payload.attachment] : []),
});

const mapSentMessage = (response: SendMessageResponse): BaseChatMessage => ({
  ...response,
  attachments: response.attachments ?? [],
});

export function Messenger() {
  const [activeUser, setActiveUser] = useState<SearchUser | null>(null);
  const [socketUserId, setSocketUserId] = useState<number | null>(null);
  const [olderMessages, setOlderMessages] = useState<BaseChatMessage[]>([]);
  const [realtimeMessages, setRealtimeMessages] = useState<BaseChatMessage[]>(
    [],
  );
  const [nextCursorOverride, setNextCursorOverride] = useState<string | null>(
    null,
  );
  const [searchValue, setSearchValue] = useState('');
  const [typingUserIds, setTypingUserIds] = useState<number[]>([]);
  const [chatUsers, setChatUsers] = useState<SearchUser[]>([]);
  const [loadedChatOwnerId, setLoadedChatOwnerId] = useState<number | null>(
    null,
  );
  const markedAsReadIdsRef = useRef<Set<string>>(new Set());
  const { data: currentUser } = useMeQuery();
  const actorUserId = currentUser?.userId
    ? Number(currentUser.userId)
    : socketUserId;

  const normalizedSearch = searchValue.trim();
  const canSearch = normalizedSearch.length >= SEARCH_MIN_LENGTH;

  const { data: users = [], isFetching: isUsersFetching } = useSearchUsersQuery(
    { username: normalizedSearch, pageSize: 20 },
    { skip: !canSearch },
  );

  const {
    data: messagesData,
    isFetching: isMessagesFetching,
    isLoading: isMessagesLoading,
  } = useGetChatMessagesQuery(
    { recipientId: activeUser?.id ?? 0, limit: MESSAGES_LIMIT },
    { skip: !activeUser },
  );

  const [loadChatMessages, { isFetching: isOlderMessagesFetching }] =
    useLazyGetChatMessagesQuery();
  const [sendMessage, { isLoading: isSending, isError: isSendError }] =
    useSendMessageMutation();
  const [markMessageAsRead] = useMarkMessageAsReadMutation();

  const baseMessages = useMemo(
    () => sortMessagesByDate(messagesData?.items ?? []),
    [messagesData?.items],
  );

  const messages = useMemo(
    () =>
      mergeMessages(
        mergeMessages(baseMessages, olderMessages),
        realtimeMessages,
      ),
    [baseMessages, olderMessages, realtimeMessages],
  );

  const activeChatId = messages[0]?.chatId ?? null;
  const nextCursor = nextCursorOverride ?? messagesData?.nextCursor ?? null;

  const resetSelectedChatState = () => {
    markedAsReadIdsRef.current = new Set();
    setOlderMessages([]);
    setRealtimeMessages([]);
    setNextCursorOverride(null);
    setTypingUserIds([]);
  };

  const handleSelectUser = (user: SearchUser) => {
    setActiveUser(user);
    resetSelectedChatState();
  };

  const handleSocketMessage = useCallback(
    (payload: ChatSocketMessagePayload) => {
      if (!activeUser) {
        return;
      }

      const belongsToSelectedUser =
        payload.senderId === activeUser.id ||
        payload.senderId === actorUserId ||
        payload.chatId === activeChatId ||
        activeChatId === null;

      if (!belongsToSelectedUser) {
        return;
      }

      setRealtimeMessages((currentMessages) =>
        mergeMessage(
          currentMessages,
          mapSocketMessage(payload, payload.senderId ?? actorUserId),
        ),
      );

      setTypingUserIds((currentIds) =>
        currentIds.filter((userId) => userId !== payload.senderId),
      );
    },
    [activeChatId, activeUser, actorUserId],
  );

  const handleMessageRead = useCallback((payload: ChatMessageReadPayload) => {
    const markAsRead = (message: BaseChatMessage) =>
      message.id === payload.messageId
        ? { ...message, readAt: payload.readAt, status: 'READ' as const }
        : message;

    setOlderMessages((currentMessages) => currentMessages.map(markAsRead));
    setRealtimeMessages((currentMessages) => currentMessages.map(markAsRead));
  }, []);

  const handleUserTyping = useCallback(
    (payload: ChatUserTypingPayload) => {
      if (payload.chatId !== activeChatId || payload.userId === actorUserId) {
        return;
      }

      setTypingUserIds((currentIds) => {
        if (!payload.isTyping) {
          return currentIds.filter((userId) => userId !== payload.userId);
        }

        return currentIds.includes(payload.userId)
          ? currentIds
          : [...currentIds, payload.userId];
      });
    },
    [activeChatId, actorUserId],
  );

  const { emitTypingStop, error: socketError } = useChatSocket({
    onConnectionEstablished: ({ userId }) => setSocketUserId(userId),
    onMessageReceived: handleSocketMessage,
    onMessageSent: handleSocketMessage,
    onMessageRead: handleMessageRead,
    onUserTyping: handleUserTyping,
  });
  const rememberChatUser = useCallback((user: SearchUser) => {
    setChatUsers((currentUsers) =>
      [
        user,
        ...currentUsers.filter((currentUser) => currentUser.id !== user.id),
      ].slice(0, MAX_STORED_CHATS),
    );
  }, []);

  useEffect(() => {
    if (!actorUserId) {
      return;
    }

    const storageKey = `${CHAT_USERS_STORAGE_PREFIX}:${actorUserId}`;
    const timeoutId = window.setTimeout(() => {
      setChatUsers(parseStoredChatUsers(localStorage.getItem(storageKey)));
      setLoadedChatOwnerId(actorUserId);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [actorUserId]);

  useEffect(() => {
    if (!actorUserId || loadedChatOwnerId !== actorUserId) {
      return;
    }

    const storageKey = `${CHAT_USERS_STORAGE_PREFIX}:${actorUserId}`;
    localStorage.setItem(storageKey, JSON.stringify(chatUsers));
  }, [actorUserId, chatUsers, loadedChatOwnerId]);

  useEffect(() => {
    if (!activeUser || !messagesData?.items.length) {
      return;
    }

    const timeoutId = window.setTimeout(() => rememberChatUser(activeUser), 0);

    return () => window.clearTimeout(timeoutId);
  }, [activeUser, messagesData?.items.length, rememberChatUser]);

  const displayedUsers = useMemo(() => {
    if (canSearch) {
      return users;
    }

    if (!activeUser || chatUsers.some((user) => user.id === activeUser.id)) {
      return chatUsers;
    }

    return [activeUser, ...chatUsers];
  }, [activeUser, canSearch, chatUsers, users]);

  const activeUserLastMessage = messages.at(-1)?.content;
  const showSearchHint = !canSearch && displayedUsers.length === 0;
  const showNoUsers = canSearch && !isUsersFetching && users.length === 0;

  useEffect(() => {
    if (!activeUser || !actorUserId) {
      return;
    }

    messages.forEach((message) => {
      const shouldMarkAsRead =
        message.senderId !== actorUserId &&
        message.readAt === null &&
        !markedAsReadIdsRef.current.has(message.id);

      if (!shouldMarkAsRead) {
        return;
      }

      markedAsReadIdsRef.current.add(message.id);
      markMessageAsRead(message.id).catch(() => {
        markedAsReadIdsRef.current.delete(message.id);
      });
    });
  }, [activeUser, actorUserId, markMessageAsRead, messages]);

  const handleLoadOlderMessages = async () => {
    if (!activeUser || !nextCursor) {
      return;
    }

    const response = await loadChatMessages({
      recipientId: activeUser.id,
      cursor: nextCursor,
      limit: MESSAGES_LIMIT,
    }).unwrap();

    setOlderMessages((currentMessages) =>
      mergeMessages(currentMessages, response.items),
    );
    setNextCursorOverride(response.nextCursor);
  };

  const handleSend = async (message: string) => {
    if (!activeUser) {
      return;
    }

    const response = await sendMessage({
      recipientId: activeUser.id,
      message,
    }).unwrap();

    setRealtimeMessages((currentMessages) =>
      mergeMessage(currentMessages, mapSentMessage(response)),
    );
    rememberChatUser(activeUser);
  };

  const handleStopTyping = () => {
    if (!activeChatId) {
      return;
    }

    emitTypingStop({ chatId: activeChatId });
  };

  return (
    <main className={s.page}>
      <Typography as="h1" variant="h1">
        Messenger
      </Typography>

      <section className={s.shell}>
        <aside className={s.sidebar} aria-label="Chats">
          <div className={s['sidebar-header']}>
            <TextField
              search
              className={s['search-field']}
              onChange={(event) => setSearchValue(event.currentTarget.value)}
              placeholder="Search"
              value={searchValue}
            />
          </div>

          <div className={s['contact-list']}>
            {displayedUsers.map((user) => (
              <button
                className={`${s['contact-item']} ${
                  user.id === activeUser?.id ? s['active-contact'] : ''
                }`}
                key={user.id}
                onClick={() => handleSelectUser(user)}
                type="button"
              >
                <UserAvatar user={user} />

                <span className={s['contact-content']}>
                  <span className={s['contact-top-line']}>
                    <Typography as="span" variant="bold_text_14">
                      {user.userName}
                    </Typography>
                  </span>

                  <Typography
                    as="span"
                    className={s['last-message']}
                    color="secondary"
                    variant="small_text"
                  >
                    {user.id === activeUser?.id && activeUserLastMessage
                      ? activeUserLastMessage
                      : 'Open private chat'}
                  </Typography>
                </span>
              </button>
            ))}

            {isUsersFetching && (
              <div className={s['list-state']}>
                <Loading />
              </div>
            )}

            {showSearchHint && (
              <Typography
                className={s['list-state']}
                color="secondary"
                variant="small_text"
              >
                Enter at least 3 characters to find a user.
              </Typography>
            )}

            {showNoUsers && (
              <Typography
                className={s['list-state']}
                color="secondary"
                variant="small_text"
              >
                No users found.
              </Typography>
            )}
          </div>
        </aside>

        <section className={s['chat-panel']} aria-label="Messages">
          {activeUser ? (
            <>
              <header className={s['chat-header']}>
                <UserAvatar user={activeUser} />

                <div>
                  <Typography variant="bold_text_16">
                    {activeUser.userName}
                  </Typography>
                  <Typography color="secondary" variant="small_text">
                    Private chat
                  </Typography>
                </div>
              </header>

              <div className={s.messages}>
                {nextCursor && (
                  <Button
                    className={s['load-older-button']}
                    disabled={isOlderMessagesFetching}
                    onClick={handleLoadOlderMessages}
                    type="button"
                    variant="secondary"
                  >
                    {isOlderMessagesFetching ? 'Loading...' : 'Load older'}
                  </Button>
                )}

                {isMessagesLoading ? (
                  <div className={s['messages-state']}>
                    <Loading />
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((message) => {
                    const isOwn = message.senderId === actorUserId;

                    return (
                      <div
                        className={`${s['message-row']} ${
                          isOwn ? s['own-message-row'] : ''
                        }`}
                        key={message.id}
                      >
                        <div
                          className={`${s['message-bubble']} ${
                            isOwn ? s['own-message-bubble'] : ''
                          }`}
                        >
                          <Typography variant="regular_text_14">
                            {message.content}
                          </Typography>

                          <span className={s['message-meta']}>
                            {formatMessageTime(new Date(message.createdAt))}
                            {isOwn && (
                              <DoneAllOutline
                                aria-hidden
                                height={14}
                                width={14}
                              />
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  !isMessagesFetching && (
                    <Typography
                      className={s['messages-state']}
                      color="secondary"
                      variant="regular_text_16"
                    >
                      No messages yet.
                    </Typography>
                  )
                )}
              </div>

              {typingUserIds.length > 0 && (
                <Typography
                  className={s['typing-indicator']}
                  color="secondary"
                  variant="small_text"
                >
                  Typing...
                </Typography>
              )}

              {isSendError && (
                <Typography
                  className={s.error}
                  color="danger"
                  variant="small_text"
                >
                  Message was not sent. Try again.
                </Typography>
              )}

              {socketError && !isSendError && (
                <Typography
                  className={s.error}
                  color="danger"
                  variant="small_text"
                >
                  Real-time updates are unavailable. Messages can still be sent.
                </Typography>
              )}

              <SendMessageForm
                disabled={!activeUser}
                isSending={isSending}
                onSendAction={handleSend}
                onStopTypingAction={handleStopTyping}
              />
            </>
          ) : (
            <div className={s['empty-state']}>
              <MessageCircleOutline aria-hidden height={48} width={48} />
              <Typography color="secondary" variant="regular_text_16">
                Search and select a user to start messaging.
              </Typography>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
