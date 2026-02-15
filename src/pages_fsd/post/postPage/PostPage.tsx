'use client';

import { useState } from 'react';
import Image from 'next/image';
import s from './PostPage.module.scss';
import {
  BookmarkOutline,
  Edit2Outline,
  HeartOutline,
  MoreHorizontalOutline,
  PaperPlaneOutline,
  TrashOutline,
} from '@/shared/ui/icons';
import { Post } from '@/entities/post/model/types/postApi.types';
import { Button } from '@/shared/ui';
import { handleNetworkError } from '@/shared/lib';
import { SignUpType } from '@/features/auth/model/validation';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/shared/hooks';
import { useProtectedRoute } from '@/shared/hooks/useProtectedRoute';
import { formatDate } from '@/entities/post/lib/formatDate';
import { useImageNavigation } from '@/entities/post/model/hooks/useImageNavigation';
import { PostImage } from '@/entities/post/ui/PostModal/PostImage/PostImage';
import { DeletePostModal } from '@/entities/post';
import { useMeQuery } from '@/features/auth/api/authApi';
import { useUpdatePostUserMutation } from '@/entities/post/api/postApi';

type Props = {
  post: Post;
};

export const PostPage = ({ post }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeletePost, setIsDeletePost] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');
  const dispatch = useAppDispatch();
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [postDescription, setPostDescription] = useState(
    post.description || '',
  );

  const { isAuthorized } = useProtectedRoute({ redirect: false });
  const { data: currentUser } = useMeQuery();
  const isOwnPost = currentUser?.userId?.toString() === post.userId?.toString();
  const [updatePost] = useUpdatePostUserMutation();
  const images = post.postFiles || [];

  const { currentIndex, nextImage, prevImage, selectImage } =
    useImageNavigation(0, images.length);

  const handleEditPost = () => {
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const handleCountLikesPost = () => {
    setLikes((prev) => prev + 1);
    setIsLiked((prev) => !prev);
  };

  const handleSaveEdit = async () => {
    const previousDescription = post.description;
    try {
      setIsEditing(false);
      await updatePost({
        postId: post.id,
        description: postDescription,
      }).unwrap();
    } catch (error) {
      setPostDescription(previousDescription || '');
      handleNetworkError({
        error,
        dispatch,
        handle400Error: (error) => {
          error.errorsMessages?.forEach((m) => {
            if (m.field) {
              console.error(m.field as keyof SignUpType, {
                type: 'server',
                message: m.message,
              });
            }
          });
        },
        handle429Error: () => {
          toast.error('Too many requests. Try again later.');
        },
        handle500Error: () => {
          toast.error('Internal server error');
        },
        handleUnknownError: () => {
          toast.error('Unexpected error');
        },
      });
    }
  };

  //const timeReal = formatDateFull(new Date());

  const handlePublishComment = () => {
    if (newComment.trim() === '') return;
    setComments((prev) => [...prev, newComment.trim()]);
    setNewComment('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setPostDescription(post.description || '');
  };

  return (
    <div className={s.container}>
      <div className={s.pageWrapper}>
        {/* Левая часть - картинка */}
        <div className={s.imageSection}>
          <PostImage
            images={images}
            currentIndex={currentIndex}
            onNextAction={nextImage}
            onPrevAction={prevImage}
            onSelectImageAction={selectImage}
          />
        </div>

        {/* Правая часть - информация */}
        <div className={s.infoSection}>
          {isEditing ? (
            <div className={s.editContainer}>
              <div className={s.header}>
                <div className={s.user}>
                  <Image
                    src={post.avatarUrl || '/User 01.jpg'}
                    alt={post.userName || 'User'}
                    className={s.avatar}
                    width={32}
                    height={32}
                  />
                  <span className={s.username}>{post.userName || 'User'}</span>
                </div>
                <button
                  className={s.closeEditButton}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>

              <div className={s.editContent}>
                <div className={s.editTitle}>Edit publication description</div>
                <textarea
                  value={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
                  className={s.editTextarea}
                  rows={4}
                  placeholder="Write a description..."
                  maxLength={500}
                  autoFocus
                />
                <div className={s.charCounter}>
                  {postDescription.length}/500
                </div>
                <div className={s.editActions}>
                  <Button onClick={handleSaveEdit} size={'md'}>
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant={'outline'}
                    size={'md'}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className={s.header}>
                <div className={s.user}>
                  <Image
                    src={post.avatarUrl || '/User 01.jpg'}
                    alt={post.userName || 'User'}
                    className={s.avatar}
                    width={32}
                    height={32}
                  />
                  <span className={s.username}>{post.userName || 'User'}</span>
                </div>

                {isAuthorized && isOwnPost && (
                  <div className={s.headerActions}>
                    <button
                      className={s.moreButton}
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      aria-label="More options"
                    >
                      <MoreHorizontalOutline />
                    </button>

                    {isMenuOpen && (
                      <div className={s.menuDropdown}>
                        <button
                          onClick={handleEditPost}
                          className={s.menuButton}
                        >
                          <Edit2Outline />
                          Edit Post
                        </button>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsDeletePost(true);
                          }}
                          className={s.menuButton}
                        >
                          <TrashOutline />
                          Delete Post
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className={s.content}>
                {/* Описание поста */}
                <div className={s.description}>
                  <div className={s.descriptionHeader}>
                    <Image
                      src={post.avatarUrl || '/User 01.jpg'}
                      alt={post.userName || 'User'}
                      className={s.commentAvatar}
                      width={36}
                      height={36}
                    />
                    <div className={s.descriptionText}>
                      <span className={s.commentUsername}>
                        {post.userName || 'User'}
                      </span>
                      <span className={s.captionText}>{post.description}</span>
                    </div>
                  </div>
                  <div className={s.timestamp}>
                    {formatDate(post.createdAt)}
                  </div>
                </div>

                {/* Комментарии */}
                <div className={s.commentsList}>
                  {comments.map((comment, index) => (
                    <div key={index} className={s.commentItem}>
                      <Image
                        src={'/User 01.jpg'}
                        alt="User"
                        className={s.commentAvatar}
                        width={36}
                        height={36}
                      />
                      <div className={s.commentContent}>
                        <span className={s.commentUsername}>
                          {currentUser?.username || 'User'}
                        </span>
                        <span className={s.commentText}>{comment}</span>
                        <div className={s.commentMeta}>
                          <span>Just now</span>
                          <button className={s.likeCommentButton}>
                            <HeartOutline width={14} height={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={s.footer}>
                <div className={s.actions}>
                  <div className={s.actionsLeft}>
                    <button
                      className={`${s.actionButton} ${isLiked ? s.liked : ''}`}
                      onClick={handleCountLikesPost}
                      aria-label="Like"
                    >
                      <HeartOutline />
                    </button>
                    <button className={s.actionButton} aria-label="Share">
                      <PaperPlaneOutline />
                    </button>
                  </div>
                  <button className={s.actionButton} aria-label="Save">
                    <BookmarkOutline />
                  </button>
                </div>

                <div className={s.likes}>
                  <span className={s.likesCount}>{likes} Likes</span>
                </div>

                <div className={s.postDate}>{formatDate(post.createdAt)}</div>

                {/* Поле ввода комментария */}
                {isAuthorized && (
                  <div className={s.commentInput}>
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className={s.input}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handlePublishComment();
                        }
                      }}
                    />
                    <Button
                      variant={'link'}
                      onClick={handlePublishComment}
                      disabled={!newComment.trim()}
                    >
                      Publish
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <DeletePostModal
        postId={post.id}
        isOpenModal={isDeletePost}
        onCloseModalAction={() => setIsDeletePost(false)}
      />
    </div>
  );
};
