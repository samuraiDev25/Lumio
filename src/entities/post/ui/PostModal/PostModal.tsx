'use client';

import { ReactNode, useState, useEffect, useMemo, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import { toast } from 'react-toastify';
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
  useGetPostByIdQuery,
  useGetPostCommentsQuery,
  useLikeCommentMutation,
} from '@/entities/post/api/postApi';
import type { Comment } from '@/entities/post/model/types/postApi.types';
import { AddComment } from '@/features/posts/add-comment/ui/AddComment';
import { handleNetworkError } from '@/shared/lib';
import { useAppDispatch } from '@/shared/hooks';
import {
  COMMENTS_UPDATED_EVENT,
  getPersistedComments,
} from '@/features/posts/add-comment/model/persistedComments';

type Props = {
  children?: ReactNode;
  post: Post;
  profile: UserProfile | null;
  initialImageIndex?: number;
  isOpen?: boolean;
  onCloseAction?: () => void;
};

function mergeComments(
  serverComments: Comment[],
  persistedComments: Comment[],
): Comment[] {
  const serverById = new Map(
    serverComments.map((comment) => [comment.id, comment]),
  );
  const persistedById = new Map(
    persistedComments.map((comment) => [comment.id, comment]),
  );
  const orderedIds = [
    ...persistedComments.map((comment) => comment.id),
    ...serverComments.map((comment) => comment.id),
  ];

  return Array.from(new Set(orderedIds)).map((commentId) => {
    const serverComment = serverById.get(commentId);
    const persistedComment = persistedById.get(commentId);

    if (!serverComment) return persistedComment!;
    if (!persistedComment) return serverComment;

    return {
      ...persistedComment,
      ...serverComment,
      replies: mergeComments(serverComment.replies, persistedComment.replies),
    };
  });
}

function removeRootDuplicatesFromReplies(comments: Comment[]): Comment[] {
  const nestedIds = new Set<number>();

  const collectNestedIds = (replies: Comment[]) => {
    replies.forEach((reply) => {
      nestedIds.add(reply.id);
      collectNestedIds(reply.replies);
    });
  };

  comments.forEach((comment) => collectNestedIds(comment.replies));

  return comments.filter((comment) => !nestedIds.has(comment.id));
}
type OptimisticCommentReactions = Record<number, Comment['userReaction']>;

function updateCommentReaction(
  comments: Comment[],
  commentId: number,
  reaction: Comment['userReaction'],
): Comment[] {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      const wasLiked = comment.userReaction === 'like';
      const isLiked = reaction === 'like';

      return {
        ...comment,
        likeCount: Math.max(
          0,
          comment.likeCount + (isLiked ? 1 : 0) - (wasLiked ? 1 : 0),
        ),
        userReaction: reaction,
      };
    }

    return {
      ...comment,
      replies: updateCommentReaction(comment.replies, commentId, reaction),
    };
  });
}

function applyOptimisticCommentReactions(
  comments: Comment[],
  reactions: OptimisticCommentReactions,
): Comment[] {
  return Object.entries(reactions).reduce(
    (nextComments, [commentId, reaction]) =>
      updateCommentReaction(nextComments, Number(commentId), reaction),
    comments,
  );
}

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
  const postId = post.id;
  const userName = profile?.username || `User ${post.userId}`;
  const avatarUrl = profile?.avatarUrl ?? '/User 03.jpg';

  const { data: postData } = useGetPostByIdQuery(postId, {
    skip: !postId,
  });

  const { data: commentsData, isLoading: commentsLoading } =
    useGetPostCommentsQuery(
      {
        postId,
        pageNumber: 1,
        pageSize: 1,
        sortBy: 'createdAt',
        sortDirection: 'desc',
      },
      {
        skip: !postId,
      },
    );
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [likeComment] = useLikeCommentMutation();
  const dispatch = useAppDispatch();
  const [persistedComments, setPersistedComments] = useState<Comment[]>(() =>
    postId ? getPersistedComments(postId) : [],
  );
  const [comments, setComments] = useState<Comment[]>([]);
  const [likingCommentIds, setLikingCommentIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [optimisticCommentReactions, setOptimisticCommentReactions] =
    useState<OptimisticCommentReactions>({});

  useEffect(() => {
    const handleCommentsUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ postId?: string }>).detail;

      if (postId && detail?.postId === postId) {
        setPersistedComments(getPersistedComments(postId));
      }
    };

    window.addEventListener(COMMENTS_UPDATED_EVENT, handleCommentsUpdated);

    return () => {
      window.removeEventListener(COMMENTS_UPDATED_EVENT, handleCommentsUpdated);
    };
  }, [postId]);

  const handleLike = useCallback(
    async (comment: Comment) => {
      if (likingCommentIds.has(comment.id) || !postId || !comment.id) return;
      const newReaction = comment.userReaction === 'like' ? 'none' : 'like';

      setLikingCommentIds((ids) => new Set(ids).add(comment.id));
      setOptimisticCommentReactions((reactions) => ({
        ...reactions,
        [comment.id]: newReaction,
      }));
      setComments((current) =>
        updateCommentReaction(current, comment.id, newReaction),
      );

      try {
        await likeComment({
          postId,
          commentId: comment.id,
          reaction: newReaction,
        }).unwrap();
      } catch (error) {
        setOptimisticCommentReactions((reactions) => {
          const nextReactions = { ...reactions };
          delete nextReactions[comment.id];
          return nextReactions;
        });
        setComments((current) =>
          updateCommentReaction(current, comment.id, comment.userReaction),
        );
        handleNetworkError({
          error,
          dispatch,
          handle400Error: (error) => {
            toast.error(
              error.errorsMessages?.[0]?.message ??
                'Invalid comment like request',
            );
          },
          handle401Error: () => {
            toast.error('Sign in to like comments');
          },
          handle404Error: (error) => {
            toast.error(
              error.errorsMessages?.[0]?.message ??
                'Comment not found or deleted',
            );
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
      } finally {
        setLikingCommentIds((ids) => {
          const nextIds = new Set(ids);
          nextIds.delete(comment.id);
          return nextIds;
        });
      }
    },
    [postId, likeComment, likingCommentIds, dispatch],
  );

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
          isLiking={likingCommentIds.has(comment.id)}
        />

        {replyTo === comment.id && parentId === null && (
          <AddComment
            postId={post.id}
            parentId={comment.id}
            parentComment={comment}
            onSuccessAction={() => setReplyTo(null)}
          />
        )}

        {comment.replies.length > 0 && (
          <div style={{ marginLeft: 50 }}>
            {renderComments(comment.replies, comment.id)}
          </div>
        )}
      </div>
    ));
  };

  const currentUserId = currentUser?.userId ? Number(currentUser.userId) : null;

  const mergedComments = useMemo(() => {
    const serverComments = commentsData?.items ?? [];
    const nextComments = removeRootDuplicatesFromReplies(
      mergeComments(serverComments, persistedComments),
    );
    const commentsWithOptimisticReactions = applyOptimisticCommentReactions(
      nextComments,
      optimisticCommentReactions,
    );

    return commentsWithOptimisticReactions.sort((a, b) => {
      if (currentUserId === null) return 0;

      if (a.userId === currentUserId) return -1;
      if (b.userId === currentUserId) return 1;

      return 0;
    });
  }, [
    commentsData?.items,
    persistedComments,
    optimisticCommentReactions,
    currentUserId,
  ]);

  useEffect(() => {
    setComments(mergedComments);
  }, [mergedComments]);

  useEffect(() => {
    if (replyTo && !comments.find((c) => c.id === replyTo)) {
      setReplyTo(null);
    }
  }, [replyTo, comments]);

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

                        {!commentsLoading && comments.length === 0 && (
                          <div>No comments</div>
                        )}

                        {!commentsLoading && renderComments(comments)}
                      </div>
                    </div>
                  </div>
                  <PostActions
                    post={post}
                    isAuthorized={isAuthorized}
                    initialLikesCount={postData?.likeCount}
                    initialIsLiked={postData?.userReaction === 'like'}
                  />
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
