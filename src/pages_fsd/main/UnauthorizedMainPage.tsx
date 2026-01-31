'use client';

import { UsersCount } from '@/shared/ui/users-count/UsersCount';
import { PostCard } from '@/features/posts/ui/PostCard';
import { BaseLayout } from '@/app/BaseLayout';
import styles from './UnauthorizedMainPage.module.scss';
import { Post } from '@/features/posts/api/postApi.types';

type UnauthorizedMainPageProps = {
  posts: Post[];
  usersCount: number;
};

/**
 * Компонент главной страницы для неавторизованных пользователей (Landing Page).
 * Отображает общедоступный контент (счетчик пользователей и последние посты),
 * полученный с сервера через ISR. Оборачивается в BaseLayout без сайдбара.
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
            posts.map((post) => <PostCard key={post.id} post={post} />)
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
