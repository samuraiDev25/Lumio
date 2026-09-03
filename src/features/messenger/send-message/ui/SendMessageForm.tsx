'use client';

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/shared/ui';
import { ImageOutline, MicOutline } from '@/shared/ui/icons';
import s from './SendMessageForm.module.scss';

type SendMessageFormProps = {
  disabled?: boolean;
  isSending?: boolean;
  onSendAction: (message: string) => Promise<void> | void;
  onStopTypingAction?: () => void;
};

const MAX_MESSAGE_LENGTH = 500;
const TYPING_STOP_DELAY = 1500;

export function SendMessageForm({
  disabled = false,
  isSending = false,
  onSendAction,
  onStopTypingAction,
}: SendMessageFormProps) {
  const [message, setMessage] = useState('');
  const typingStopTimeoutRef = useRef<number | null>(null);

  const trimmedMessage = message.trim();
  const hasMessage = trimmedMessage.length > 0;
  const isSubmitDisabled = disabled || isSending || !hasMessage;

  const clearTypingStopTimeout = () => {
    if (typingStopTimeoutRef.current !== null) {
      window.clearTimeout(typingStopTimeoutRef.current);
      typingStopTimeoutRef.current = null;
    }
  };

  const stopTyping = () => {
    clearTypingStopTimeout();
    onStopTypingAction?.();
  };

  useEffect(
    () => () => {
      if (typingStopTimeoutRef.current !== null) {
        window.clearTimeout(typingStopTimeoutRef.current);
      }
    },
    [],
  );

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    try {
      await onSendAction(trimmedMessage);
    } catch {
      return;
    }

    setMessage('');
    stopTyping();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();
    void handleSubmit();
  };

  const handleChange = (value: string) => {
    setMessage(value);
    clearTypingStopTimeout();
    typingStopTimeoutRef.current = window.setTimeout(
      stopTyping,
      TYPING_STOP_DELAY,
    );
  };

  return (
    <form className={s.form} onSubmit={handleSubmit}>
      <textarea
        aria-label="Message"
        className={s.textarea}
        disabled={disabled || isSending}
        maxLength={MAX_MESSAGE_LENGTH}
        onBlur={stopTyping}
        onChange={(event) => handleChange(event.currentTarget.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type Message..."
        rows={1}
        value={message}
      />

      <div className={s.actions}>
        {hasMessage ? (
          <Button
            aria-label="Send message"
            className={s['send-button']}
            disabled={isSubmitDisabled}
            type="submit"
            variant="link"
          >
            Send message
          </Button>
        ) : (
          <>
            <button
              aria-label="Voice message"
              className={s['icon-button']}
              disabled
              type="button"
            >
              <MicOutline aria-hidden height={24} width={24} />
            </button>
            <button
              aria-label="Attach image"
              className={s['icon-button']}
              disabled
              type="button"
            >
              <ImageOutline aria-hidden height={24} width={24} />
            </button>
          </>
        )}
      </div>
    </form>
  );
}
