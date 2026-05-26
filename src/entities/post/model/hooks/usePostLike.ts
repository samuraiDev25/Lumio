'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import { toast } from 'react-toastify';
import type { AppDispatch, RootState } from '@/app/store';
import {
  useLikePostMutation,
  useUnlikePostMutation,
} from '@/entities/post/api/postApi';
import {
  findPostInCaches,
  patchPostLikeInCaches,
} from '@/entities/post/lib/patchPostLikeInCaches';
import type { Post } from '@/entities/post/model/types/postApi.types';
import { useMeQuery } from '@/features/auth/api/authApi';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';

export function usePostLike(post: Post) {
  const dispatch = useAppDispatch() as AppDispatch;
  const store = useStore<RootState>();
  const { data: me } = useMeQuery();
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();

  const cachedPost = useAppSelector((s) => findPostInCaches(s, post.id));
  console.log('cachedPost', cachedPost);
  const [likesCount, setLikesCount] = useState<number>(post.likesCount ?? 0);
  const [isLiked, setIsLiked] = useState<boolean>(post.isLiked ?? false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLikesCount(post.likesCount ?? 0);
    setIsLiked(post.isLiked ?? false);
  }, [post.id, post.likesCount, post.isLiked]);

  useEffect(() => {
    if (!cachedPost) return;
    setLikesCount(cachedPost.likesCount ?? 0);
    setIsLiked(cachedPost.isLiked ?? false);
  }, [cachedPost]);

  const toggleLike = useCallback(async () => {
    if (!me) {
      toast.info('Sign in to like posts');
      return;
    }
    if (isSubmitting) return;

    const snapshot = { likesCount, isLiked };
    const nextIsLiked = !isLiked;
    const nextCount = Math.max(0, likesCount + (nextIsLiked ? 1 : -1));
    const optimistic = { likesCount: nextCount, isLiked: nextIsLiked };

    setIsSubmitting(true);
    setLikesCount(optimistic.likesCount);
    setIsLiked(optimistic.isLiked);
    patchPostLikeInCaches(dispatch, store.getState(), post.id, optimistic);

    try {
      const response = await (
        nextIsLiked
          ? likePost({ postId: String(post.id) })
          : unlikePost({ postId: String(post.id) })
      ).unwrap();

      const server = {
        likesCount: response.likesCount,
        isLiked: response.isLiked,
      };
      setLikesCount(server.likesCount);
      setIsLiked(server.isLiked);
      patchPostLikeInCaches(dispatch, store.getState(), post.id, server);
    } catch {
      setLikesCount(snapshot.likesCount);
      setIsLiked(snapshot.isLiked);
      patchPostLikeInCaches(dispatch, store.getState(), post.id, snapshot);
      toast.error('Could not update like');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    dispatch,
    isLiked,
    isSubmitting,
    likePost,
    likesCount,
    me,
    post.id,
    store,
    unlikePost,
  ]);

  return { likesCount, isLiked, isSubmitting, toggleLike };
}
