'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SearchUser } from '@/entities/user';
import { getUserProfileFollowRoute } from '@/shared/lib/routes/routes';
import { Typography } from '@/shared/ui';
import s from '../../Search.module.scss';

const getInitial = (name: string) => name.trim().charAt(0).toUpperCase() || '?';

type Props = {
  user: SearchUser;
};

export const UserItem = ({ user }: Props) => (
  <li>
    <Link
      className={s.userLink}
      href={getUserProfileFollowRoute(String(user.id))}
    >
      {user.avatarUrl ? (
        <Image
          className={s.avatar}
          src={user.avatarUrl}
          alt={user.userName}
          width={24}
          height={24}
        />
      ) : (
        <span className={s.avatarPlaceholder}>{getInitial(user.userName)}</span>
      )}

      <span className={s.userInfo}>
        <Typography as="span" variant="bold_text_14">
          <u>{user.userName}</u>
        </Typography>
        <Typography as="span" variant="small_text" color="secondary">
          {user.userName}
        </Typography>
      </span>
    </Link>
  </li>
);
