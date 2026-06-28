'use client';

import { useState } from 'react';
import Image from 'next/image';
import s from './PostPage.module.scss';
import {
  BookmarkOutline,
  Edit2Outline,
  Heart,
  HeartOutline,
  MoreHorizontalOutline,
  PaperPlaneOutline,
  TrashOutline,
} from '@/shared/ui/icons';
import { Comment, Post } from '@/entities/post/model/types/postApi.types';
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
import {
  useGetPostCommentsQuery,
  useUpdatePostUserMutation,
} from '@/entities/post/api/postApi';
import { usePostLike } from '@/entities/post/model/hooks/usePostLike';
import { AddComment } from '@/features/posts/add-comment/ui/AddComment';

type Props = {
  post: Post;
};

export const PostPage = ({ post }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeletePost, setIsDeletePost] = useState(false);
  const dispatch = useAppDispatch();
  const [postDescription, setPostDescription] = useState(
    post.description || '',
  );

  const { isAuthorized } = useProtectedRoute({ redirect: false });
  const { data: currentUser } = useMeQuery();
  const isOwnPost = currentUser?.userId?.toString() === post.userId?.toString();
  const [updatePost] = useUpdatePostUserMutation();
  const postId = post.id;
  const { likeCount, isLiked, isSubmitting, toggleLike } = usePostLike({
    postId,
  });
  const images = post.postFiles || [];
  const { data: commentsData, isLoading: commentsLoading } =
    useGetPostCommentsQuery({
      postId,
      pageNumber: 1,
      pageSize: 5,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    });
  const comments = commentsData?.items ?? [];
  const { currentIndex, nextImage, prevImage, selectImage } =
    useImageNavigation(0, images.length);

  const handleEditPost = () => {
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const handleSaveEdit = async () => {
    const previousDescription = post.description;
    try {
      setIsEditing(false);
      await updatePost({
        postId: post.id!,
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

  const renderComments = (items: Comment[]) =>
    items.map((comment) => (
      <div key={comment.id} className={s.commentItem}>
        <Image
          src={comment.avatarUrl || '/User 01.jpg'}
          alt={comment.username || 'User'}
          className={s.commentAvatar}
          width={36}
          height={36}
        />
        <div className={s.commentContent}>
          <span className={s.commentUsername}>
            {comment.username || 'User'}
          </span>
          <span className={s.commentText}>{comment.content}</span>
          <div className={s.commentMeta}>
            <span>{formatDate(comment.createdAt)}</span>
            <span>
              {comment.likeCount === 1
                ? '1 like'
                : `${comment.likeCount} likes`}
            </span>
            <button className={s.likeCommentButton}>
              <HeartOutline width={14} height={14} />
            </button>
          </div>
          {comment.replies.length > 0 && (
            <div className={s.repliesList}>
              {renderComments(comment.replies)}
            </div>
          )}
        </div>
      </div>
    ));

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
                    {formatDate(post.createdAt!)}
                  </div>
                </div>

                {/* Комментарии */}
                <div className={s.commentsList}>
                  {commentsLoading && <div>Loading...</div>}
                  {!commentsLoading && comments.length === 0 && (
                    <div>No comments</div>
                  )}
                  {!commentsLoading && renderComments(comments)}
                </div>
              </div>

              <div className={s.footer}>
                <div className={s.actions}>
                  <div className={s.actionsLeft}>
                    <button
                      type="button"
                      className={`${s.actionButton} ${isLiked ? s.liked : ''}`}
                      onClick={() => void toggleLike()}
                      aria-label={isLiked ? 'Unlike' : 'Like'}
                      aria-pressed={isLiked}
                      disabled={isSubmitting}
                    >
                      {isLiked ? <Heart /> : <HeartOutline />}
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
                  <span className={s.likesCount}>{likeCount} Likes</span>
                </div>

                <div className={s.postDate}>{formatDate(post.createdAt!)}</div>

                {/* Поле ввода комментария */}
                {isAuthorized && (
                  <div className={s.commentInput}>
                    <AddComment postId={postId} />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <DeletePostModal
        postId={post.id!}
        isOpenModal={isDeletePost}
        onCloseModalAction={() => setIsDeletePost(false)}
      />
    </div>
  );
};
