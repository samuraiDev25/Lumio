'use client';

import {
  WheelEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useLazyGetMainPageDataQuery } from '@/entities/post/api/postApi';
import { PostCard } from '@/entities/post/ui/PostCard/PostCard';
import { PostWithReaction } from '@/entities/post/model/types/postApi.types';
import type { UserProfile } from '@/pages_fsd/profile/modal/types/profileApi.types';
import { Loading } from '@/shared/ui/loading/Loading';
import { UsersCount } from '@/shared/ui/users-count/UsersCount';
import s from './MainContent.module.scss';

type PostsFeedProps = {
  posts: PostWithReaction[];
  pagesCount: number;
  usersCount: number;
  profileByUserId: Record<number, UserProfile | null>;
};

const PAGE_SIZE = 4;
const SCROLL_EDGE_THRESHOLD_PX = 48;

export function PostsFeed({
  posts,
  pagesCount,
  usersCount,
  profileByUserId,
}: PostsFeedProps) {
  const [page, setPage] = useState(1);
  const [visiblePosts, setVisiblePosts] = useState(posts);
  const [currentPagesCount, setCurrentPagesCount] = useState(pagesCount);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const isResettingScrollRef = useRef(false);
  const lockRef = useRef(false);
  const pageRef = useRef(1);
  const pagesCountRef = useRef(pagesCount);
  const isPageLoadingRef = useRef(false);
  const [loadPage] = useLazyGetMainPageDataQuery();

  const resetViewportPosition = () => {
    if (!viewportRef.current) return;

    const element = viewportRef.current;
    isResettingScrollRef.current = true;
    element.scrollTop = 0;

    requestAnimationFrame(() => {
      isResettingScrollRef.current = false;
    });
  };

  useLayoutEffect(() => {
    resetViewportPosition();
  }, []);

  useEffect(() => {
    setPage(1);
    setVisiblePosts(posts);
    setCurrentPagesCount(pagesCount);
    pageRef.current = 1;
    pagesCountRef.current = pagesCount;
    resetViewportPosition();
  }, [posts, pagesCount]);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    pagesCountRef.current = currentPagesCount;
  }, [currentPagesCount]);

  useEffect(() => {
    isPageLoadingRef.current = isPageLoading;
  }, [isPageLoading]);

  const loadPageByNumber = async (nextPage: number) => {
    if (nextPage < 1 || nextPage > pagesCountRef.current) return;
    if (isPageLoadingRef.current) return;
    if (lockRef.current) return;

    lockRef.current = true;
    isPageLoadingRef.current = true;
    setIsPageLoading(true);

    try {
      const response = await loadPage(
        { pageNumber: nextPage, pageSize: PAGE_SIZE },
        true,
      ).unwrap();

      setPage(nextPage);
      setCurrentPagesCount(response.posts.pagesCount);
      setVisiblePosts(response.posts.items);
      pageRef.current = nextPage;
      pagesCountRef.current = response.posts.pagesCount;
      resetViewportPosition();
    } finally {
      lockRef.current = false;
      isPageLoadingRef.current = false;
      setIsPageLoading(false);
    }
  };
  const handleViewportWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (isResettingScrollRef.current) return;
    if (isPageLoadingRef.current) return;
    if (lockRef.current) return;

    const element = event.currentTarget;
    const maxScrollTop = element.scrollHeight - element.clientHeight;
    const hasPrev = pageRef.current > 1;
    const hasNext = pageRef.current < pagesCountRef.current;
    const isNearTop = element.scrollTop <= SCROLL_EDGE_THRESHOLD_PX;
    const isNearBottom =
      element.scrollTop >= maxScrollTop - SCROLL_EDGE_THRESHOLD_PX;

    if (event.deltaY < 0 && isNearTop) {
      if (hasPrev) {
        event.preventDefault();
        void loadPageByNumber(pageRef.current - 1);
      } else {
        event.preventDefault();
      }
      return;
    }

    if (event.deltaY > 0 && isNearBottom) {
      if (hasNext) {
        event.preventDefault();
        void loadPageByNumber(pageRef.current + 1);
      } else {
        event.preventDefault();
      }
    }
  };
  if (visiblePosts.length === 0) {
    return (
      <div className={s.main}>
        <div className={s['users-count-wrapper']}>
          <UsersCount count={usersCount} />
        </div>

        <div className={s['no-posts']}>
          Постов пока нет, но они скоро появятся!
        </div>
      </div>
    );
  }

  return (
    <div className={s.main}>
      <div className={s['users-count-wrapper']}>
        <UsersCount count={usersCount} />
      </div>

      <div
        ref={viewportRef}
        className={s['scroll-viewport']}
        onWheel={handleViewportWheel}
      >
        <div className={s['posts-grid']}>
          {visiblePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              profile={profileByUserId[post.userId]}
            />
          ))}
        </div>
      </div>

      {isPageLoading && (
        <div className={s['users-count-wrapper']}>
          <Loading />
        </div>
      )}
    </div>
  );
}
