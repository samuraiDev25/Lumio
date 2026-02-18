import s from '@/entities/post/ui/PostModal/PostModal.module.scss';
import Image from 'next/image';
import { MoreHorizontalOutline } from '@/shared/ui/icons';
import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  userName: string;
  avatarUrl: string;
  isAuthorized: boolean;
  isOwnPost: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
};
export const PostHeader = ({
  avatarUrl,
  userName,
  isAuthorized,
  isOwnPost,
  children,
  isMenuOpen,
  setIsMenuOpen,
}: Props) => {
  return (
    <div className={s.header}>
      <div className={s.user}>
        <Image
          src={avatarUrl || '/User 01.jpg'}
          alt={userName}
          className={s.avatar}
          width={32}
          height={32}
        />
        <span className={s.username}>{userName}</span>
      </div>
      {isAuthorized && isOwnPost && (
        <div className={s.headerActions}>
          <button
            className={s.moreButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="More options"
          >
            <MoreHorizontalOutline />
          </button>
          {isMenuOpen && children}
        </div>
      )}
    </div>
  );
};
