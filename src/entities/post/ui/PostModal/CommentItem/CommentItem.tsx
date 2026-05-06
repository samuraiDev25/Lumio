import s from './CommentItem.module.scss';
import Image from 'next/image';
import { HeartOutline } from '@/shared/ui/icons';
import { formatDate } from '@/entities/post/lib/formatDate';

type Props = {
  userName: string;
  avatarUrl: string;
  text: string;
  createdAt: string;
  likes?: number;
  isLiked?: boolean;
  onLikeAction?: () => void;
  onAnswerAction?: () => void;
  showActions?: boolean;
  isLiking?: boolean;
};

export const CommentItem = ({
  userName,
  avatarUrl,
  text,
  createdAt,
  isLiked,
  likes = 0,
  onLikeAction,
  onAnswerAction,
  showActions = true,
  isLiking = false,
}: Props) => {
  return (
    <div className={s.commentsContainer}>
      <div className={s.captionWrapper}>
        <Image
          src={avatarUrl}
          alt={'anotherUserName1'}
          className={s.commentAvatar}
          width={36}
          height={36}
        />
        <div className={s.captionContent}>
          <div className={s.textCaptionContent}>
            <span className={s.commentUsername}>
              {userName} <span className={s.captionText}>{text}</span>
            </span>
          </div>

          {showActions && onLikeAction && (
            <button
              className={`${s.heartBeating} ${isLiked ? s.heartLiked : ''}`}
              onClick={onLikeAction}
              disabled={isLiking}
              aria-label={isLiked ? 'Убрать лайк' : 'Поставить лайк'}
            >
              {isLiking ? (
                <HeartOutline className={s.heartLoading} />
              ) : (
                <HeartOutline />
              )}
              {isLiking && <span className={s.loadingText}>...</span>}
            </button>
          )}
        </div>
      </div>
      {showActions && (
        <div className={s.timestamp}>
          <div>{formatDate(createdAt)}</div>
          <div>Like: {likes}</div>
          <div>
            <span onClick={onAnswerAction}>Answer</span>
          </div>
        </div>
      )}
    </div>
  );
};
