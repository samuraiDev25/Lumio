import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type {
  ChatConnectionEstablishedPayload,
  ChatMessageReadPayload,
  ChatSocketErrorPayload,
  ChatSocketMessagePayload,
  ChatUserTypingPayload,
  SendTypingStopPayload,
} from '@/entities/message';

type ChatSocketStatus = 'idle' | 'connecting' | 'connected' | 'disconnected';
const logSocketStatus = (status: string, details?: unknown) => {
  console.info(`[ChatSocket] ${status}`, details ?? '');
};

type UseChatSocketParams = {
  enabled?: boolean;
  onConnectionEstablished?: (payload: ChatConnectionEstablishedPayload) => void;
  onMessageSent?: (payload: ChatSocketMessagePayload) => void;
  onMessageReceived?: (payload: ChatSocketMessagePayload) => void;
  onMessageRead?: (payload: ChatMessageReadPayload) => void;
  onUserTyping?: (payload: ChatUserTypingPayload) => void;
  onError?: (payload: ChatSocketErrorPayload) => void;
};
const CHAT_SOCKET_URL =
  process.env.NEXT_PUBLIC_CHAT_SOCKET_URL ?? 'https://lumio.su';

export function useChatSocket({
  enabled = true,
  onConnectionEstablished,
  onMessageSent,
  onMessageReceived,
  onMessageRead,
  onUserTyping,
  onError,
}: UseChatSocketParams) {
  const socketRef = useRef<Socket | null>(null);
  const handlersRef = useRef<UseChatSocketParams>({});
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [status, setStatus] = useState<ChatSocketStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handlersRef.current = {
      onConnectionEstablished,
      onMessageSent,
      onMessageReceived,
      onMessageRead,
      onUserTyping,
      onError,
    };
  }, [
    onConnectionEstablished,
    onError,
    onMessageRead,
    onMessageReceived,
    onMessageSent,
    onUserTyping,
  ]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    const token = localStorage.getItem('accessToken');

    if (!token) {
      const timeoutId = window.setTimeout(() => {
        setStatus('disconnected');
        setError('Unauthorized: Missing token');
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    const connectingTimeoutId = window.setTimeout(() => {
      setStatus('connecting');
      setError(null);
    }, 0);

    const socket = io(CHAT_SOCKET_URL, {
      autoConnect: false,
      path: '/socket.io',
      auth: { token },
      transports: ['websocket', 'polling'],
      tryAllTransports: true,
      withCredentials: true,
    });

    logSocketStatus('connecting', {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      url: CHAT_SOCKET_URL,
    });

    socketRef.current = socket;

    const handleAccessTokenUpdated = () => {
      const refreshedToken = localStorage.getItem('accessToken');

      if (!refreshedToken) {
        return;
      }

      socket.auth = { token: refreshedToken };
      logSocketStatus('access_token_updated');
      socket.disconnect().connect();
    };

    window.addEventListener(
      'auth:access-token-updated',
      handleAccessTokenUpdated,
    );

    const updateSocketToken = (attempt: number) => {
      socket.auth = { token: localStorage.getItem('accessToken') };
      logSocketStatus('reconnect_attempt', { attempt });
    };

    const handleReconnect = (attempt: number) => {
      logSocketStatus('reconnected', { attempt });
    };

    const handleReconnectError = (reconnectError: Error) => {
      console.error('[ChatSocket] reconnect_error', reconnectError);
    };

    const handleReconnectFailed = () => {
      console.error('[ChatSocket] reconnect_failed');
    };

    const handleManagerError = (managerError: Error) => {
      console.error('[ChatSocket] manager_error', managerError);
    };

    socket.io.on('reconnect_attempt', updateSocketToken);
    socket.io.on('reconnect', handleReconnect);
    socket.io.on('reconnect_error', handleReconnectError);
    socket.io.on('reconnect_failed', handleReconnectFailed);
    socket.io.on('error', handleManagerError);

    socket.on('connect', () => {
      logSocketStatus('connected', {
        id: socket.id,
        transport: socket.io.engine.transport.name,
      });

      socket.io.engine.once('upgrade', (transport) => {
        logSocketStatus('transport_upgraded', { transport: transport.name });
      });
      setStatus('connected');
      setError(null);
    });

    socket.on(
      'connection:established',
      (payload: ChatConnectionEstablishedPayload) => {
        setCurrentUserId(payload.userId);
        handlersRef.current.onConnectionEstablished?.(payload);
      },
    );

    socket.on('message:sent', (payload: ChatSocketMessagePayload) => {
      handlersRef.current.onMessageSent?.(payload);
    });

    socket.on('message:received', (payload: ChatSocketMessagePayload) => {
      handlersRef.current.onMessageReceived?.(payload);
    });

    socket.on('message:read', (payload: ChatMessageReadPayload) => {
      handlersRef.current.onMessageRead?.(payload);
    });

    socket.on('user:typing', (payload: ChatUserTypingPayload) => {
      handlersRef.current.onUserTyping?.(payload);
    });

    socket.on('exception', (payload: ChatSocketErrorPayload) => {
      console.error('[ChatSocket] exception', payload);
      setError(payload.message);
      handlersRef.current.onError?.(payload);
    });

    socket.on('error', (payload: ChatSocketErrorPayload) => {
      console.error('[ChatSocket] server_error', payload);
      setError(payload.message);
      handlersRef.current.onError?.(payload);

      if (payload.message.includes('Unauthorized')) {
        socket.disconnect();
      }
    });

    socket.on('connect_error', (socketError) => {
      const errorWithData = socketError as Error & { data?: unknown };

      console.error('[ChatSocket] connect_error', {
        data: errorWithData.data,
        message: socketError.message,
      });
      setStatus('disconnected');
      setError(socketError.message);
    });

    socket.on('disconnect', (reason, details) => {
      console.warn('[ChatSocket] disconnected', { details, reason });
      setStatus('disconnected');
    });

    socket.connect();

    return () => {
      window.clearTimeout(connectingTimeoutId);
      window.removeEventListener(
        'auth:access-token-updated',
        handleAccessTokenUpdated,
      );
      socket.io.off('reconnect_attempt', updateSocketToken);
      socket.io.off('reconnect', handleReconnect);
      socket.io.off('reconnect_error', handleReconnectError);
      socket.io.off('reconnect_failed', handleReconnectFailed);
      socket.io.off('error', handleManagerError);
      logSocketStatus('cleanup');
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [enabled]);

  const emitTypingStop = useCallback((payload: SendTypingStopPayload) => {
    socketRef.current?.emit('typing:stop', payload);
  }, []);

  return {
    currentUserId,
    emitTypingStop,
    error,
    status,
  };
}
