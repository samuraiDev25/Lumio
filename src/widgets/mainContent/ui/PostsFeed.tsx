'use client';

import { PostCard } from '@/entities/post/ui/PostCard/PostCard';
import { Post } from '@/entities/post/model/types/postApi.types';
import type { UserProfile } from '@/pages_fsd/profile/modal/types/profileApi.types';
import { UsersCount } from '@/shared/ui/users-count/UsersCount';
import s from './MainContent.module.scss';

type PostsFeedProps = {
  posts: Post[];
  usersCount: number;
  profileByUserId: Record<number, UserProfile | null>;
};

export function PostsFeed({
  posts,
  usersCount,
  profileByUserId,
}: PostsFeedProps) {
  const renderPosts = () => {
    if (posts.length === 0) {
      return (
        <div className={s['no-posts']}>
          Постов пока нет, но они скоро появятся!
        </div>
      );
    }

    return posts.map((post) => (
      <PostCard
        key={post.id}
        post={post}
        profile={profileByUserId[post.userId]}
      />
    ));
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
