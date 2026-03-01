'use client';

import { PostCard } from '@/entities/post/ui/PostCard/PostCard';
import { UsersCount } from '@/shared/ui/users-count/UsersCount';
import { Post } from '@/entities/post/model/types/postApi.types';
import s from './MainContent.module.scss'; // Используем те же стили

type PostsFeedProps = {
  posts: Post[];
  usersCount: number;
};

export function PostsFeed({ posts, usersCount }: PostsFeedProps) {
  const renderPosts = () => {
    if (posts.length === 0) {
      return (
        <div className={s['no-posts']}>
          Постов пока нет, но они скоро появятся!
        </div>
      );
    }
    return posts.map((post) => <PostCard key={post.id} post={post} />);
  };

  return (
    <div className={s.main}>
      <div className={s['users-count-wrapper']}>
        <UsersCount count={usersCount} />
      </div>

      <div className={s['posts-grid']}>{renderPosts()}</div>
    </div>
  );
}
