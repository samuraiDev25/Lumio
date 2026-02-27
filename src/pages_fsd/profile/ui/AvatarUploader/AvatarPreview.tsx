import s from './AvatarUploader.module.scss';
import { Close, ImageOutline } from '@/shared/ui/icons';
import Image from 'next/image';

interface Props {
  currentAvatar?: string | null;
  onDelete: () => void;
  disabled?: boolean;
}

export const AvatarPreview = ({ currentAvatar, onDelete, disabled }: Props) => (
  <div className={s['avatar-container']}>
    <div className={s['avatar-wrap']}>
      {currentAvatar ? (
        <Image
          src={currentAvatar}
          alt="User avatar"
          className={s['avatar-img']}
          width={192}
          height={192}
          priority
        />
      ) : (
        <ImageOutline className={s['avatar-placeholder-icon']} />
      )}
    </div>
    {currentAvatar && (
      <button
        className={s['delete-btn']}
        onClick={onDelete}
        type="button"
        disabled={disabled}
      >
        <Close width={16} height={16} />
      </button>
    )}
  </div>
);
