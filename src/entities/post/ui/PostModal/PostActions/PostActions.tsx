'use client';

import s from './PostActions.module.scss';
import {
  BookmarkOutline,
  Heart,
  HeartOutline,
  PaperPlaneOutline,
} from '@/shared/ui/icons';
import { formatDateFull } from '@/entities/post/lib/formatDate';
import { AddComment } from '@/features/posts/add-comment/ui/AddComment';
import type { Post } from '@/entities/post/model/types/postApi.types';
import { usePostLike } from '@/entities/post/model/hooks/usePostLike';

type Props = {
  post: Post;
  isAuthorized: boolean;
  initialLikesCount?: number;
  initialIsLiked?: boolean;
};
export const PostActions = ({
  post,
  isAuthorized,
  initialLikesCount,
  initialIsLiked,
}: Props) => {
  const timeReal = formatDateFull(new Date());
  const { likeCount, isLiked, isSubmitting, toggleLike } = usePostLike({
    postId: post.id,
    initialLikesCount,
    initialIsLiked,
  });

  return (
    <div className={s.footer}>
      <div className={s.actions}>
        <div className={s.actionsLeft}>
          <button
            type="button"
            className={`${s.actionButton} ${isLiked ? s.liked : ''}`}
            aria-label={isLiked ? 'Unlike' : 'Like'}
            aria-pressed={isLiked}
            disabled={isSubmitting}
            onClick={() => void toggleLike()}
          >
            {isLiked ? <Heart /> : <HeartOutline />}
          </button>
          <button className={s.actionButton} aria-label="Share">
            <PaperPlaneOutline />
          </button>
        </div>
        <button className={s.actionButton} aria-label="Save">
          <BookmarkOutline />
        </button>
      </div>

      <div className={s.likes}>
        <span className={s.likesCount}>{likeCount} Likes</span>
      </div>
      <div className={s.timeReal}>
        <div>{timeReal}</div>
      </div>

      {/* Поле ввода комментария */}
      {isAuthorized && <AddComment postId={String(post.id)} />}
    </div>
  );
};
