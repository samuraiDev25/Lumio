'use client';

import s from './Feed.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useGetMainPageDataQuery } from '@/entities/post/api/postApi';
import { PostWithReaction } from '@/entities/post/model/types/postApi.types';
import { FeedPostCard } from '@/entities/post/ui/PostCard/FeedPostCard';
import { Loading } from '@/shared/ui/loading/Loading';

const PAGE_SIZE = 8;

/**
 * Чистая функция для объединения постов.
 * Вынесена за пределы компонента, чтобы код был человеческим и понятным.
 */
const getUpdatedPosts = (
  prev: PostWithReaction[],
  newItems: PostWithReaction[],
  isFirstPage: boolean,
) => {
  if (isFirstPage) return newItems;

  const filteredNewItems = newItems.filter(
    (newItem) => !prev.some((oldItem) => oldItem.id === newItem.id),
  );
  return [...prev, ...filteredNewItems];
};

export function Feed() {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<PostWithReaction[]>([]);

  const { data, isLoading, isFetching } = useGetMainPageDataQuery({
    pageNumber: page,
    pageSize: PAGE_SIZE,
  });

  const pagesCount = data?.posts?.pagesCount || 1;
  const hasMore = page < pagesCount;
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Синхронизация данных с API и нашим стейтом
  useEffect(() => {
    const items = data?.posts?.items;
    if (!items) return;

    // Используем таймаут, чтобы избежать ошибки линтера о каскадных рендерах.
    // Это говорит Реакту: "сначала отрисуй страницу, а потом обнови список".
    const timeoutId = setTimeout(() => {
      setAllPosts((prev) => getUpdatedPosts(prev, items, page === 1));
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [data, page]);

  // Логика бесконечного скролла
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
    );

    const currentAnchor = loadMoreRef.current;
    if (currentAnchor) observer.observe(currentAnchor);

    return () => {
      if (currentAnchor) observer.unobserve(currentAnchor);
    };
  }, [hasMore, isFetching]);

  if (isLoading && page === 1) {
    return (
      <div className={s.centerLoading}>
        <Loading />
      </div>
    );
  }

  return (
    <main className={s['feed-page']}>
      <div className={`${s['posts-list']} feedContext`}>
        {allPosts.length > 0
          ? allPosts.map((post) => <FeedPostCard key={post.id} post={post} />)
          : !isFetching && (
              <p className={s.empty}>No posts yet. Subscribe to someone!</p>
            )}
      </div>

      {/* Точка, за которую цепляется скролл */}
      <div ref={loadMoreRef} className={s['loader-anchor']}>
        {isFetching && <Loading />}
      </div>
    </main>
  );
}
