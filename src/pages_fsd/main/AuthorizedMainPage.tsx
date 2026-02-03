'use client';

import { UsersCount } from '@/shared/ui/users-count/UsersCount';
import { PostCard } from '@/features/posts/ui/PostCard';
import MainLayout from '@/app/MainLayout';
import styles from './AuthorizedMainPage.module.scss';
import { Post } from '@/features/posts/api/postApi.types';

type AuthorizedMainPageProps = {
  posts: Post[];
  usersCount: number;
};

/**
 * Home page component for authorized users.
 *
 * Features:
 * 1. Layout: Wrapped in 'MainLayout', which includes the Sidebar and authorized Header.
 * 2. Content: Displays a feed of public posts and the community user counter.
 * 3. Data Flow: Receives pre-fetched data via props from the parent 'MainPageClientWrapper'.
 */
export function AuthorizedMainPage({
  posts,
  usersCount,
}: AuthorizedMainPageProps) {
  return (
    <MainLayout>
      <div className={styles.main}>
        <div className={styles['users-count-wrapper']}>
          <UsersCount count={usersCount} />
        </div>

        <div className={styles['posts-grid']}>
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className={styles['no-posts']}>
              Постов пока нет, но они скоро появятся!
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
