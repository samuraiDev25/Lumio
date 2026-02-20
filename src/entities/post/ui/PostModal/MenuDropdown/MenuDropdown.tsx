import s from './MenuDropdown.module.scss';
import { Edit2Outline, TrashOutline } from '@/shared/ui/icons';

type Props = {
  onEditPostAction: () => void;
  onDeletePostAction: () => void;
};
export const MenuDropdown = ({
  onDeletePostAction,
  onEditPostAction,
}: Props) => {
  return (
    <div className={s.menuDropdown}>
      <button onClick={onEditPostAction} className={s.menuButton}>
        <Edit2Outline />
        EditPost
      </button>
      <button onClick={onDeletePostAction} className={s.menuButton}>
        <TrashOutline />
        Delete Post
      </button>
    </div>
  );
};
