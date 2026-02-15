import Image from 'next/image';
import { Button } from '@/shared/ui';
import { CloseOutline } from '@/shared/ui/icons';
import s from './EditPostForm.module.scss';

type EditPostFormProps = {
  description: string;
  userName: string;
  avatarUrl: string;
  onChangeAction: (value: string) => void;
  onSaveAction: () => void;
  onCloseAction: () => void;
  maxLength?: number;
};

export const EditPostForm = ({
  description,
  userName,
  avatarUrl,
  onChangeAction,
  onSaveAction,
  onCloseAction,
  maxLength = 500,
}: EditPostFormProps) => {
  return (
    <div className={s.editContainer}>
      <div className={s.hederEditPost}>
        <div className={s.user}>
          <span className={s.username}>EditPost</span>
        </div>
        <button className={s.closeButton} onClick={onCloseAction}>
          <CloseOutline />
        </button>
      </div>

      <div className={s.editWrapper}>
        <div className={s.user}>
          <Image
            src={avatarUrl}
            alt={userName}
            className={s.avatar}
            width={32}
            height={32}
          />
          <span className={s.username}>{userName}</span>
        </div>

        <div className={s.editTitle}>Add publication description</div>

        <textarea
          value={description}
          onChange={(e) => onChangeAction(e.target.value)}
          className={s.editTextarea}
          rows={4}
          placeholder="Write a description..."
          maxLength={maxLength}
        />

        <div className={s.charCounter}>
          {description.length}/{maxLength}
        </div>

        <div className={s.buttonContainer}>
          <Button onClick={onSaveAction} className={s.saveButton} size={'md'}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
