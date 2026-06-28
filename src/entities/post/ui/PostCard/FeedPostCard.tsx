'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useGetPostByIdQuery } from '@/entities/post/api/postApi';
import { useFollowUserMutation, type UserFeedPost } from '@/entities/user';
import { useMeQuery } from '@/features/auth/api/authApi';
import { AddComment } from '@/features/posts/add-comment/ui/AddComment';
import {
  COMMENTS_UPDATED_EVENT,
  getPersistedComments,
} from '@/features/posts/add-comment/model/persistedComments';
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
  post: UserFeedPost;
};

export const FeedPostCard = ({ post }: Props) => {
  const { data: me } = useMeQuery();
  const feedLikesCount = post.likesCount ?? post.likeCount ?? 0;
  const feedIsLiked = post.isLiked ?? post.userReaction === 'like';
  const { likeCount, isLiked, isSubmitting, toggleLike } = usePostLike({
    postId: post.id,
    initialLikesCount: feedLikesCount,
    initialIsLiked: feedIsLiked,
  });

  const { data: postDetails } = useGetPostByIdQuery(post.id, {
    skip: !post.id || feedLikesCount === 0,
  });
  const [persistedCommentsCount, setPersistedCommentsCount] = useState(0);
  const commentsCount = (post.commentsCount ?? 0) + persistedCommentsCount;
  const currentUserId = me?.userId ? Number(me.userId) : null;
  /** Если пост мой — скрываем кнопку отписки (нельзя отписаться от себя) */
  const isMyPost = currentUserId === post.userId;

  const [unfollow] = useUnfollowUserMutation();
  const [follow] = useFollowUserMutation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isFollowing, setIsFollowing] = useState(true);

  const userName = post.username || `User ${post.userId}`;
  const avatarUrl = post.avatarUrl;
  const newestLikes = postDetails?.newestLikes ?? [];

  useEffect(() => {
    const updatePersistedCommentsCount = () => {
      setPersistedCommentsCount(getPersistedComments(post.id).length);
    };

    updatePersistedCommentsCount();
    window.addEventListener(
      COMMENTS_UPDATED_EVENT,
      updatePersistedCommentsCount,
    );

    return () => {
      window.removeEventListener(
        COMMENTS_UPDATED_EVENT,
        updatePersistedCommentsCount,
      );
    };
  }, [post.id]);

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
      <div className={s['avatar-box']} style={{ width: size, height: size }}>
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt=""
            width={size}
            height={size}
            className={s['avatar-img']}
          />
        ) : (
          <span className={s['letter-placeholder']}>{firstLetter}</span>
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
            {newestLikes.length > 0 && (
              <div className={s['avatars-stack']}>
                {newestLikes.slice(0, 3).map((like) => {
                  const firstLetter = like.username?.[0]?.toUpperCase() ?? 'U';

                  return (
                    <div className={s['mini-avatar']} key={like.userId}>
                      {like.avatarUrl ? (
                        <Image
                          src={like.avatarUrl}
                          alt={like.username}
                          width={24}
                          height={24}
                          className={s['mini-avatar-img']}
                        />
                      ) : (
                        <span className={s['mini-letter']}>{firstLetter}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <Typography
              variant="regular_text_14"
              className={s['likes-count-text']}
            >
              <strong>{likeCount}</strong> {likeCount === 1 ? 'like' : 'likes'}
            </Typography>
          </div>

          {/* Место для UC-4: просмотр комментариев */}
          <Link
            href={`/posts/${post.id}?returnTo=/feed`}
            className={s['view-comments']}
          >
            View All Comments ({commentsCount})
          </Link>

          {/* Место для UC-3: создание комментария */}
          <div className={s['add-comment']}>
            <AddComment postId={post.id} />
          </div>
        </div>
      </footer>
    </article>
  );
};
