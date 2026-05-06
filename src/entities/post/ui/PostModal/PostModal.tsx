'use client';

import { ReactNode, useState, useEffect, useMemo, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import s from './PostModal.module.scss';
import { CloseOutline } from '@/shared/ui/icons';
import { Post } from '@/entities/post/model/types/postApi.types';
import type { UserProfile } from '@/pages_fsd/profile/modal/types/profileApi.types';
import { ConfirmClosePost } from '@/entities/post/ui/ConfirmClosePost/ConfirmClosePost';
import { useProtectedRoute } from '@/shared/hooks/useProtectedRoute';
import { formatDate } from '@/entities/post/lib/formatDate';
import { useImageNavigation } from '@/entities/post/model/hooks/useImageNavigation';
import { PostImage } from '@/entities/post/ui/PostModal/PostImage/PostImage';
import { DeletePostModal } from '@/entities/post';
import { useMeQuery } from '@/features/auth/api/authApi';
import { EditPostForm, useEditPost } from '@/features/posts/edit-post';
import { PostHeader } from '@/entities/post/ui/PostModal/PostHeader/PostHeader';
import { CommentItem } from '@/entities/post/ui/PostModal/CommentItem/CommentItem';
import { PostActions } from '@/entities/post/ui/PostModal/PostActions/PostActions';
import { MenuDropdown } from '@/entities/post/ui/PostModal/MenuDropdown/MenuDropdown';
import {
  useGetPostCommentsQuery,
  useLikeCommentMutation,
} from '@/entities/post/api/postApi';
import type { Comment } from '@/entities/post/model/types/postApi.types';
import { AddComment } from '@/features/posts/add-comment/ui/AddComment';

type Props = {
  children?: ReactNode;
  post: Post;
  profile: UserProfile | null;
  initialImageIndex?: number;
  isOpen?: boolean;
  onCloseAction?: () => void;
};

export const PostModal = ({
  children,
  post,
  profile,
  initialImageIndex,
  isOpen: externalOpen,
  onCloseAction: externalOnClose,
}: Props) => {
  const [open, setOpen] = useState(false);
  const isControlled = externalOpen !== undefined;
  const actualOpen = isControlled ? externalOpen : open;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isDeletePost, setIsDeletePost] = useState(false);

  const [isClosePost, setIsClosePost] = useState(false);
  const {
    isEditing,
    description,
    startEditing,
    cancelEditing,
    saveEdit,
    setDescription,
    hasUnsavedChanges,
  } = useEditPost(post.id, post.description || '');
  const { isAuthorized } = useProtectedRoute({ redirect: false });
  const { data: currentUser } = useMeQuery();
  const isOwnPost = currentUser?.userId?.toString() === post.userId?.toString();
  const images = post.postFiles || [];
  const userName = profile?.username || `User ${post.userId}`;
  const avatarUrl = profile?.avatarUrl ?? '/User 03.jpg';

  const { data: commentsData, isLoading: commentsLoading } =
    useGetPostCommentsQuery({
      postId: post.id,
      pageNumber: 1,
      pageSize: 20,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    });
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [likeComment, { isLoading: isLiking }] = useLikeCommentMutation();

  const handleLike = useCallback(
    async (comment: Comment) => {
      if (isLiking) return;
      const newReaction = comment.userReaction === 'like' ? 'none' : 'like';

      try {
        await likeComment({
          postId: post.id,
          commentId: comment.id,
          reaction: newReaction,
        }).unwrap();
      } catch (error) {
        console.error('Like failed:', error);
      }
    },
    [post.id, likeComment, isLiking],
  );

  const isLikingComment = useCallback((commentId: number) => {
    return false;
  }, []);

  const renderComments = (
    comments: Comment[],
    parentId: number | null = null,
  ) => {
    return comments.map((comment) => (
      <div key={comment.id}>
        <CommentItem
          userName={comment.username}
          avatarUrl={comment.avatarUrl || '/User 03.jpg'}
          text={comment.content}
          createdAt={comment.createdAt}
          likes={comment.likeCount}
          isLiked={comment.userReaction === 'like'}
          onLikeAction={() => handleLike(comment)}
          onAnswerAction={() => setReplyTo(comment.id)}
          isLiking={isLikingComment(comment.id)}
        />

        {replyTo === comment.id && parentId === null && (
          <AddComment
            postId={post.id}
            parentId={comment.id}
            onSuccess={() => setReplyTo(null)}
          />
        )}

        {comment.replies.length > 0 && (
          <div style={{ marginLeft: 40 }}>
            {renderComments(comment.replies, comment.id)}
          </div>
        )}
      </div>
    ));
  };

  const currentUserId = currentUser?.userId ? Number(currentUser.userId) : null;

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const sortedComments = useMemo(() => {
    if (!commentsData?.items) return [];
    return [...commentsData.items].sort((a, b) => {
      if (currentUserId === null) return 0;

      if (a.userId === currentUserId) return -1;
      if (b.userId === currentUserId) return 1;

      return 0;
    });
  }, [commentsData?.items, currentUserId]);

  useEffect(() => {
    if (replyTo && !commentsData?.items.find((c) => c.id === replyTo)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReplyTo(null);
    }
  }, [replyTo, commentsData]);

  const handleRequestClose = () => {
    // Если в режиме редактирования и есть несохранённые изменения
    if (isEditing && description !== (post.description || '')) {
      setIsClosePost(true);
      return;
    }
    if (isEditing) {
      cancelEditing();
      return;
    }
    if (externalOnClose) {
      externalOnClose();
    }
    setOpen(false);
  };
  const { currentIndex, nextImage, prevImage, selectImage } =
    useImageNavigation(initialImageIndex ?? 0, images.length);

  const onCloseOpenDeleteModal = () => {
    setIsMenuOpen(false);
    setIsDeletePost(true);
  };

  const handleCloseEditing = () => {
    if (hasUnsavedChanges()) {
      setIsClosePost(true);
    } else {
      cancelEditing();
    }
  };
  const handleEditPost = () => {
    startEditing();
    setIsMenuOpen(false);
  };
  // Подтверждение закрытия
  const handleConfirmClose = () => {
    cancelEditing();
    setIsClosePost(false);
  };

  // Отмена закрытия
  const handleCancelClose = () => {
    setIsClosePost(false);
  };
  const handleClickOutside = (e: Event) => {
    if (isEditing) {
      e.preventDefault();
      if (description !== (post.description || '')) {
        setIsClosePost(true);
      } else {
        cancelEditing();
      }
    }
  };
  return (
    <Dialog.Root
      open={actualOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleRequestClose();
          return;
        }
        if (!isControlled) {
          setOpen(true);
        }
      }}
    >
      {children && <Dialog.Trigger asChild>{children}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className={s.overlay} />
        <Dialog.Content
          className={`${s.content} ${isClosePost ? s.modalDisabled : ''}`}
          onPointerDownOutside={handleClickOutside}
        >
          <Dialog.Title className={s.dialogTitle}>
            Post by {userName}
          </Dialog.Title>
          <Dialog.Close className={s.closeButton}>
            <CloseOutline />
          </Dialog.Close>
          <div className={s.modalWrapper}>
            <PostImage
              images={images}
              currentIndex={currentIndex}
              onNextAction={nextImage}
              onPrevAction={prevImage}
              onSelectImageAction={selectImage}
            />

            {/* Правая часть - информация */}
            <div className={s.infoSection}>
              {isEditing ? (
                <EditPostForm
                  userName={userName}
                  avatarUrl={avatarUrl}
                  description={description}
                  onCloseAction={handleCloseEditing}
                  onChangeAction={setDescription}
                  onSaveAction={saveEdit}
                />
              ) : (
                <>
                  <div className={s.commentsContainer}>
                    <PostHeader
                      userName={userName}
                      avatarUrl={avatarUrl}
                      isAuthorized={isAuthorized}
                      isOwnPost={isOwnPost}
                      isMenuOpen={isMenuOpen}
                      setIsMenuOpen={() => setIsMenuOpen(!isMenuOpen)}
                    >
                      <MenuDropdown
                        onEditPostAction={handleEditPost}
                        onDeletePostAction={onCloseOpenDeleteModal}
                      />
                    </PostHeader>
                    <div className={s.scrollArea}>
                      <div className={s.descriptionContainer}>
                        <div className={s.captionWrapper}>
                          <Image
                            src={avatarUrl}
                            alt={userName}
                            className={s.commentAvatar}
                            width={36}
                            height={36}
                          />
                          <div className={s.captionContent}>
                            <div className={s.textCaptionContent}>
                              <span className={s.commentUsername}>
                                {userName}{' '}
                                <span className={s.captionText}>
                                  {description}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={s.timestamp}>
                          <div>{formatDate(post.createdAt)}</div>
                        </div>
                      </div>

                      <div className={s.commentsList}>
                        {commentsLoading && <div>Loading...</div>}

                        {!commentsLoading && sortedComments.length === 0 && (
                          <div>No comments</div>
                        )}

                        {!commentsLoading && renderComments(sortedComments)}
                      </div>
                    </div>
                  </div>
                  <PostActions post={post} isAuthorized={isAuthorized} />
                </>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
      <ConfirmClosePost
        isOpen={isClosePost}
        onCloseAction={handleCancelClose}
        onConfirmAction={handleConfirmClose}
      />
      <DeletePostModal
        postId={post.id}
        isOpenModal={isDeletePost}
        onCloseModalAction={() => {
          setIsDeletePost(false);
          setIsClosePost(false);
          setOpen(false);
          if (externalOnClose) {
            externalOnClose();
          }
        }}
      />
    </Dialog.Root>
  );
};
