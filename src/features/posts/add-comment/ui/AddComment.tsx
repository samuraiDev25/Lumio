'use client';

import { Button } from '@/shared/ui';
import s from './CommentForm.module.scss';
import { useAddCommentMutation } from '@/entities/post/api/postApi';
import type { Comment } from '@/entities/post/model/types/postApi.types';
import { ChangeEvent, FormEvent, useState } from 'react';
import { handleNetworkError } from '@/shared/lib';
import { useAppDispatch } from '@/shared/hooks';
import { toast } from 'react-toastify';
import { persistComment } from '@/features/posts/add-comment/model/persistedComments';

type Props = {
  postId: string;
  parentId?: number;
  parentComment?: Comment;
  onSuccessAction?: () => void;
};

export const AddComment = ({
  postId,
  parentId,
  parentComment,
  onSuccessAction,
}: Props) => {
  const [text, setText] = useState('');
  const [addComment, { isLoading }] = useAddCommentMutation();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedText = text.trim();
    if (!trimmedText) return;

    try {
      const comment = await addComment({
        postId,
        content: trimmedText,
        parentCommentId: parentId,
      }).unwrap();
      persistComment(postId, comment, parentId, parentComment);
      setText('');
      onSuccessAction?.();
    } catch (error) {
      handleNetworkError({
        error,
        dispatch,
        handle400Error: (error) => {
          toast.error(
            error.errorsMessages?.[0]?.message ?? 'Invalid comment text',
          );
        },
        handle401Error: () => {
          toast.error('Sign in to comment');
        },
        handle404Error: () => {
          toast.error('Post or comment was not found');
        },
        handle429Error: () => {
          toast.error('Too many requests. Try again later.');
        },
        handle500Error: () => {
          toast.error('Internal server error');
        },
        handleUnknownError: () => {
          toast.error('Could not publish comment');
        },
      });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 300) {
      setText(value);
    }
  };

  const isButtonDisabled = !text.trim() || isLoading;
  const isReply = parentId !== undefined;

  return (
    <form
      onSubmit={handleSubmit}
      className={`${s.inputWrapper} ${isReply ? s['reply-input-wrapper'] : ''}`}
    >
      <input
        className={s.input}
        value={text}
        onChange={handleChange}
        placeholder={isReply ? 'Write a reply...' : 'Add a Comment...'}
        maxLength={300}
      />
      <Button
        className={s.submitButton}
        type="submit"
        disabled={isButtonDisabled}
        variant={'outline'}
      >
        Publish
      </Button>
    </form>
  );
};
