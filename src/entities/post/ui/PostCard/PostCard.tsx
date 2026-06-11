'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Post } from '@/entities/post/model/types/postApi.types';
import type { UserProfile } from '@/pages_fsd/profile/modal/types/profileApi.types';
import { getRelativeTime } from '@/shared/lib';
import { PostImageSlider } from './PostImageSlider';
import { PostDescription } from './PostDescription';
import s from './PostCard.module.scss';
import Link from 'next/link';

type PostCardProps = {
  post: Post;
  profile?: UserProfile | null;
};

export const PostCard = ({ post, profile }: PostCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  const images = post.postFiles || [];
  const description = post.description || '';
  //const userName = post.userName || `User${post.userId}`;
  const userName = profile?.username || `User ${post.userId}`;
  const avatarUrl = profile?.avatarUrl;

  return (
    <article className={s.card}>
      <PostImageSlider
        images={images}
        postId={post.id}
        isExpanded={isExpanded}
        from="main"
        profileId={String(post.userId)}
      />

      <div className={s.content}>
        <div className={s['user-row']}>
          <div className={s.avatar}>
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={userName}
                width={36}
                height={36}
                className={s['avatar-image']}
              />
            ) : (
              userName[0].toUpperCase()
            )}
          </div>
          <div className={s['user-name']}>
            <Link href={`/profile/${post.userId}`}>{userName}</Link>
          </div>
        </div>

        <div className={s.time}>{getRelativeTime(post.createdAt, 'en')}</div>
        <PostDescription
          text={description}
          isExpanded={isExpanded}
          onToggle={handleToggleExpand}
        />
      </div>
    </article>
  );
};
