'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import { toast } from 'react-toastify';
import type { AppDispatch, RootState } from '@/app/store';
import { useUpdatePostReactionMutation } from '@/entities/post/api/postApi';
import { patchPostLikeInCaches } from '@/entities/post/lib/patchPostLikeInCaches';
import type { Reaction } from '@/entities/post/model/types/postApi.types';
import { useMeQuery } from '@/features/auth/api/authApi';
import { useAppDispatch } from '@/shared/hooks';

type UsePostLikeParams = {
  postId: string;
  initialLikeCount?: number;
  initialReaction?: Reaction;
};

export function usePostLike({
  postId,
  initialLikeCount = 0,
  initialReaction = 'none',
}: UsePostLikeParams) {
  const dispatch = useAppDispatch() as AppDispatch;
  const store = useStore<RootState>();
  const { data: me } = useMeQuery();
  const [updatePostReaction] = useUpdatePostReactionMutation();
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [userReaction, setUserReaction] = useState<Reaction>(initialReaction);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLikeCount(initialLikeCount);
    setUserReaction(initialReaction);
  }, [postId, initialLikeCount, initialReaction]);

  const isLiked = userReaction === 'like';

  const toggleLike = useCallback(async () => {
    if (!me) {
      toast.info('Sign in to like posts');
      return;
    }
    if (isSubmitting) return;

    const snapshot = { likeCount, userReaction };
    const nextReaction: Reaction = isLiked ? 'none' : 'like';
    const optimistic = {
      likeCount: Math.max(0, likeCount + (nextReaction === 'like' ? 1 : -1)),
      userReaction: nextReaction,
    };

    setIsSubmitting(true);
    setLikeCount(optimistic.likeCount);
    setUserReaction(optimistic.userReaction);
    patchPostLikeInCaches(dispatch, store.getState(), postId, optimistic);

    try {
      await updatePostReaction({
        postId,
        status: nextReaction,
      }).unwrap();
    } catch {
      setLikeCount(snapshot.likeCount);
      setUserReaction(snapshot.userReaction);
      patchPostLikeInCaches(dispatch, store.getState(), postId, snapshot);
      toast.error('Could not update like');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    dispatch,
    isLiked,
    isSubmitting,
    likeCount,
    me,
    postId,
    store,
    updatePostReaction,
    userReaction,
  ]);

  return {
    likeCount,
    userReaction,
    isLiked,
    isSubmitting,
    toggleLike,
  };
}
