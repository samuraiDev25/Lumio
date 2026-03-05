'use client';

import { useState } from 'react';
import { Post } from '@/entities/post/model/types/postApi.types';
import { getRelativeTime } from '@/shared/lib';
import { PostImageSlider } from './PostImageSlider';
import { PostDescription } from './PostDescription';
import s from './PostCard.module.scss';

type PostCardProps = {
  post: Post;
};

export const PostCard = ({ post }: PostCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  const images = post.postFiles || [];
  const description = post.description || '';

  return (
    <article className={s.card}>
      <PostImageSlider
        images={images}
        postId={post.id}
        isExpanded={isExpanded}
        from="main"
        profileId={post.userId}
      />

      <div className={s.content}>
        <div className={s['user-row']}>
          <div className={s.avatar}>U</div>
          <div className={s['user-name']}>User {post.userId}</div>
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
