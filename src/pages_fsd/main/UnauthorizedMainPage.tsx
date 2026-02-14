'use client';

import { UsersCount } from '@/shared/ui/users-count/UsersCount';
import { PostCard } from '@/features/posts/ui/PostCard';
import { BaseLayout } from '@/app/BaseLayout';
import styles from './UnauthorizedMainPage.module.scss';
import { Post } from '@/entities/post/model/types/postApi.types';
import Link from 'next/link';

type UnauthorizedMainPageProps = {
  posts: Post[];
  usersCount: number;
};

/**
 * Main page component for unauthorized users (Landing Page).
 *
 * Logic:
 * 1. Content: Displays public data including the user counter and the latest posts
 *    fetched from the server via ISR.
 * 2. Layout: Wrapped in 'BaseLayout', which provides a guest-friendly interface
 *    without the sidebar.
 */
export function UnauthorizedMainPage({
  posts,
  usersCount,
}: UnauthorizedMainPageProps) {
  return (
    <BaseLayout>
      <main className={styles.main}>
        <div className={styles['users-count-wrapper']}>
          <UsersCount count={usersCount} />
        </div>

        <div className={styles['posts-grid']}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                scroll={false}
                style={{ textDecoration: 'none' }}
              >
                <PostCard post={post} />
              </Link>
            ))
          ) : (
            <div className={styles['no-posts']}>
              Постов пока нет, но они скоро появятся!
            </div>
          )}
        </div>
      </main>
    </BaseLayout>
  );
}
