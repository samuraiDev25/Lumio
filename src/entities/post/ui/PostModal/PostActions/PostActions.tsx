import s from './PostActions.module.scss';
import {
  BookmarkOutline,
  HeartOutline,
  PaperPlaneOutline,
} from '@/shared/ui/icons';
import { CommentForm } from '@/features/posts/add-comment/ui/CommentForm';
import { formatDateFull } from '@/entities/post/lib/formatDate';
import { useAddComment } from '@/features/posts/add-comment/model/useAddComment';

type Props = {
  likes: number;
  isAuthorized: boolean;
};
export const PostActions = ({ likes, isAuthorized }: Props) => {
  const timeReal = formatDateFull(new Date());
  const { comments, newComment, addComment, updateComment } = useAddComment();
  return (
    <div className={s.footer}>
      <div className={s.actions}>
        <div className={s.actionsLeft}>
          <button className={s.actionButton} aria-label="Like">
            <HeartOutline />
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
        <span className={s.likesCount}>{likes} Likes</span>
      </div>
      <div className={s.timeReal}>
        <div>{timeReal}</div>
      </div>

      {/* Поле ввода комментария */}
      {isAuthorized && (
        <CommentForm
          value={newComment}
          onChangeAction={updateComment}
          onSubmitAction={addComment}
          placeholder={'Add a Comment...'}
        />
      )}
    </div>
  );
};
