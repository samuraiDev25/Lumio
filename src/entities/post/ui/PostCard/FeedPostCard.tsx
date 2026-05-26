'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Post } from '@/entities/post/model/types/postApi.types';
import {
  useFollowUserMutation,
  useGetUserDetailedProfileQuery,
} from '@/entities/user';
import { useMeQuery } from '@/features/auth/api/authApi';
import { getRelativeTime } from '@/shared/lib';
import { Typography } from '@/shared/ui';
import {
  MoreHorizontal,
  PersonRemoveOutline,
  PersonAddOutline,
  CopyOutline,
  Heart,
  HeartOutline,
  MessageCircleOutline,
  PaperPlaneOutline,
  BookmarkOutline,
} from '@/shared/ui/icons';
import s from './FeedPostCard.module.scss';
import { useUnfollowUserMutation } from '@/entities/user/api/userFollowsApi';
import { FeedPostSlider } from './FeedPostSlider';
import { usePostLike } from '@/entities/post/model/hooks/usePostLike';

type Props = {
  post: Post;
};

export const FeedPostCard = ({ post }: Props) => {
  const { data: me } = useMeQuery();
  const { likesCount, isLiked, isSubmitting, toggleLike } = usePostLike(post);
  const currentUserId = me?.userId ? Number(me.userId) : null;

  /** Если пост мой — скрываем кнопку отписки (нельзя отписаться от себя) */
  const isMyPost = currentUserId === post.userId;

  /**
   * Запрос профиля автора для получения статуса подписки (isFollowing).
   * skip: оптимизация — не запрашиваем профиль, если это наш собственный пост, чтобы не грузить сервер
   */
  const { data: profile } = useGetUserDetailedProfileQuery(post.userId, {
    skip: !post.userId || isMyPost,
  });

  const [unfollow] = useUnfollowUserMutation();
  const [follow] = useFollowUserMutation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const userName = profile?.username || post.userName || `User ${post.userId}`;
  const avatarUrl = profile?.avatarUrl || post.avatarUrl;

  /** Обновляем кнопку подписки, когда данные профиля загрузятся */
  useEffect(() => {
    if (profile) {
      setIsFollowing(profile.isFollowing);
    }
  }, [profile]);

  /** Логика закрытия выпадающего меню при клике в любую область экрана */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  /** Переключение статуса подписки (Follow/Unfollow) */
  const handleToggleFollow = async () => {
    setIsMenuOpen(false);
    try {
      if (isFollowing) {
        // Метод Unfollow использует DELETE /api/v1/users/{userId}/follow
        await unfollow({ userId: post.userId }).unwrap();
        setIsFollowing(false);
        toast.info(`Unfollowed ${userName}`);
      } else {
        await follow({ userId: post.userId, currentUserId }).unwrap();
        setIsFollowing(true);
        toast.success(`Following ${userName}`);
      }
    } catch (e) {
      console.error('Follow action error:', e);
      toast.error('Action failed');
    }
  };

  /** Копирование ссылки на пост в буфер обмена */
  const copyToClipboard = async () => {
    const link = `${window.location.origin}/posts/${post.id}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    } finally {
      setIsMenuOpen(false);
    }
  };

  /** Рендер аватара с фолбеком на первую букву имени */
  const renderAvatar = (size = 36) => {
    const firstLetter = userName ? userName[0].toUpperCase() : 'U';
    return (
      <div className={s.avatarBox} style={{ width: size, height: size }}>
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt=""
            width={size}
            height={size}
            className={s.avatarImg}
          />
        ) : (
          <span className={s.letterPlaceholder}>{firstLetter}</span>
        )}
      </div>
    );
  };

  return (
    <article className={s.card}>
      <header className={s.header}>
        <div className={s['user-group']}>
          {renderAvatar()}
          <div className={s['user-text']}>
            <Link href={`/profile/${post.userId}`} className={s['user-name']}>
              {userName}
            </Link>
            <span className={s.dot}>•</span>
            <span className={s.time}>
              {getRelativeTime(post.createdAt, 'en')}
            </span>
          </div>
        </div>

        {!isMyPost && (
          <div className={s['menu-wrapper']} ref={menuRef}>
            <button
              className={`${s['dots-btn']} ${isMenuOpen ? s.active : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MoreHorizontal />
            </button>
            {isMenuOpen && (
              <div className={s.dropdown}>
                <button onClick={handleToggleFollow} className={s['menu-item']}>
                  {isFollowing ? <PersonRemoveOutline /> : <PersonAddOutline />}
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
                <button onClick={copyToClipboard} className={s['menu-item']}>
                  <CopyOutline />
                  Copy Link
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <div className={s['image-content']}>
        <FeedPostSlider images={post.postFiles || []} postId={post.id} />
      </div>

      <footer className={s.footer}>
        <div className={s['actions-row']}>
          <div className={s['left-actions']}>
            <button
              type="button"
              className={`${s['icon-btn']} ${isLiked ? s.liked : ''}`}
              aria-label={isLiked ? 'Unlike' : 'Like'}
              aria-pressed={isLiked}
              disabled={isSubmitting}
              onClick={() => void toggleLike()}
            >
              {isLiked ? <Heart /> : <HeartOutline />}
            </button>
            <button className={s['icon-btn']}>
              <MessageCircleOutline />
            </button>
            <button className={s['icon-btn']}>
              <PaperPlaneOutline />
            </button>
          </div>
          <button className={s['icon-btn']}>
            <BookmarkOutline />
          </button>
        </div>

        <div className={s['post-info']}>
          <div className={s['description-block']}>
            {renderAvatar()}
            <div className={s['text-container']}>
              <Typography variant="regular_text_14">
                <span className={s['author-name']}>{userName}</span>{' '}
                {post.description}
              </Typography>
            </div>
          </div>

          <div className={s['like-group']}>
            {/* Место для UC-5: аватарки лайкнувших */}
            <div className={s['avatars-stack']}>
              <div className={s['mini-avatar']}>
                <span className={s['mini-letter']}>A</span>
              </div>
              <div className={s['mini-avatar']}>
                <span className={s['mini-letter']}>B</span>
              </div>
              <div className={s['mini-avatar']}>
                <span className={s['mini-letter']}>C</span>
              </div>
            </div>
            <Typography
              variant="regular_text_14"
              className={s['likes-count-text']}
            >
              <strong>{likesCount.toLocaleString()}</strong>{' '}
              {likesCount === 1 ? 'like' : 'likes'}
            </Typography>
          </div>

          {/* Место для UC-4: просмотр комментариев */}
          <Link href={`/posts/${post.id}`} className={s['view-comments']}>
            View All Comments (114)
          </Link>

          {/* Место для UC-3: создание комментария */}
          <div className={s['add-comment']}>
            <input
              placeholder="Add a Comment..."
              className={s['comment-input']}
            />
            <button className={s['publish-btn']}>Publish</button>
          </div>
        </div>
      </footer>
    </article>
  );
};
