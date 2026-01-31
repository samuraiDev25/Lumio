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
 * Компонент главной страницы для авторизованных пользователей.
 * Использует MainLayout, который включает в себя Sidebar и Header авторизованного пользователя.
 * Отображает ленту публичных постов и счетчик пользователей.
 * Данные приходят пропсами от родительского MainPageClientWrapper.
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
