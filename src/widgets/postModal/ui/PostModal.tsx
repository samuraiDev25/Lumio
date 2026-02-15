'use client';

import { ReactNode, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import s from './PostModal.module.scss';
import {
  BookmarkOutline,
  CloseOutline,
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
import { ConfirmClosePost } from '@/entities/post/ui/confirmClosePost/ConfirmClosePost';
import { useProtectedRoute } from '@/shared/hooks/useProtectedRoute';
import { formatDate, formatDateFull } from '@/entities/post/lib/formatDate';
import { useImageNavigation } from '@/widgets/postModal/model/useImageNavigation';
import { PostImage } from '@/entities/post/ui/PostImage/PostImage';
import { DeletePostModal } from '@/entities/post';
import { useMeQuery } from '@/features/auth/api/authApi';
import { useUpdatePostUserMutation } from '@/entities/post/api/postApi';

type Props = {
  children?: ReactNode;
  post: Post;
  userName: string;
  avatarUrl: string;
  initialImageIndex?: number;
  likesPost?: number;
  isOpen?: boolean;
  onCloseAction?: () => void;
};

export const PostModal = ({
  children,
  post,
  userName,
  avatarUrl,
  initialImageIndex,
  likesPost = 0,
  isOpen: externalOpen,
  onCloseAction: externalOnClose,
}: Props) => {
  const [open, setOpen] = useState(false);
  const isControlled = externalOpen !== undefined;
  const actualOpen = isControlled ? externalOpen : open;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [isDeletePost, setIsDeletePost] = useState(false);

  const [isClosePost, setIsClosePost] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');
  const dispatch = useAppDispatch();
  const [likes, setLikes] = useState<number>(likesPost);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [postDescription, setPostDescription] = useState(
    post.description || '',
  );

  const { isAuthorized } = useProtectedRoute({ redirect: false });
  const { data: currentUser } = useMeQuery();
  const isOwnPost = currentUser?.userId?.toString() === post.userId?.toString();
  const [updatePost] = useUpdatePostUserMutation();
  const images = post.postFiles || [];
  const handleRequestClose = () => {
    // Если в режиме редактирования и есть несохранённые изменения
    if (isEditing && postDescription !== (post.description || '')) {
      setIsClosePost(true);
      return;
    }
    // Если редактируем, но изменений нет - просто выходим из режима редактирования
    if (isEditing) {
      setIsEditing(false);
      return;
    }
    if (externalOnClose) {
      externalOnClose();
    }
    setOpen(false);
  };
  const { currentIndex, nextImage, prevImage, selectImage } =
    useImageNavigation(initialImageIndex ?? 0, images.length);
  const handleEditPost = () => {
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const onCloseOpenDeleteModal = () => {
    setIsMenuOpen(false);
    setIsDeletePost(true);
  };

  const handleCountLikesPost = () => {
    setLikes((prev) => prev + 1);
    setIsLiked((prev) => !prev);
  };
  const handleSaveEdit = async () => {
    const previousDescription = post.description;
    try {
      // Оптимистично обновляем UI
      setIsEditing(false);

      // Отправляем запрос
      await updatePost({
        postId: post.id,
        description: postDescription,
      }).unwrap();
    } catch (error) {
      // В случае ошибки возвращаем предыдущее значение
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

  const timeReal = formatDateFull(new Date());

  const handlePublishComment = () => {
    if (newComment.trim() === '') return;
    setComments((prev) => [...prev, newComment.trim()]);
    setNewComment('');
  };
  // Функция для закрытия редактирования с подтверждением
  const handleCloseEditing = () => {
    if (postDescription !== (post.description || '')) {
      // Если есть несохраненные изменения, показываем подтверждение
      setIsClosePost(true);
    } else {
      // Если изменений нет, просто закрываем
      setIsEditing(false);
    }
  };

  // Подтверждение закрытия
  const handleConfirmClose = () => {
    setIsEditing(false);
    setIsClosePost(false);
    setPostDescription(post.description || '');
  };

  // Отмена закрытия
  const handleCancelClose = () => {
    setIsClosePost(false);
  };

  return (
    <Dialog.Root
      open={actualOpen}
      onOpenChange={(nextOpen) => {
        // Radix вызывает onOpenChange(false) при overlay click / Esc
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
          onPointerDownOutside={(e) => {
            if (isEditing) {
              e.preventDefault();
              if (postDescription !== (post.description || '')) {
                setIsClosePost(true);
              } else {
                setIsEditing(false);
              }
            }
          }}
        >
          <Dialog.Title className={s.dialogTitle}>
            Post by {userName}
          </Dialog.Title>
          <Dialog.Close className={s.closeButton}>
            <CloseOutline />
          </Dialog.Close>
          <div className={s.modalWrapper}>
            {/* Часть поста с картинкой */}
            <PostImage
              images={images}
              currentIndex={currentIndex}
              onNextAction={nextImage}
              onPrevAction={prevImage}
              onSelectImageAction={selectImage}
            />

            {/* Правая часть - информация */}
            <div className={s.infoSection}>
              {/* Комментарии */}
              {isEditing ? (
                <>
                  <div className={s.editContainer}>
                    <div className={s.hederEditPost}>
                      <div className={s.user}>
                        <span className={s.username}>EditPost</span>
                      </div>

                      <button
                        className={s.closeEditPost}
                        onClick={handleCloseEditing}
                      >
                        <CloseOutline />
                      </button>
                    </div>
                    <div className={s.editWrapper}>
                      <div className={s.user}>
                        <Image
                          src={avatarUrl}
                          alt={userName}
                          className={s.avatar}
                          width={32}
                          height={32}
                        />
                        <span className={s.username}>{userName}</span>
                      </div>
                      <div className={s.editTitle}>
                        Add publication descriptions
                      </div>
                      <textarea
                        value={postDescription}
                        onChange={(e) => setPostDescription(e.target.value)}
                        className={s.editTextarea}
                        rows={4}
                        placeholder={
                          postDescription || 'Write a description...'
                        }
                        maxLength={500}
                      />
                      <div className={s.charCounter}>
                        {postDescription.length}/500
                      </div>
                      <div className={s.buttonContainer}>
                        <Button
                          onClick={handleSaveEdit}
                          className={s.saveButton}
                          size={'md'}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className={s.commentsContainer}>
                    <div className={s.header}>
                      <div className={s.user}>
                        <Image
                          src={avatarUrl || '/User 01.jpg'}
                          alt={userName}
                          className={s.avatar}
                          width={32}
                          height={32}
                        />
                        <span className={s.username}>{userName}</span>
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

                          {/* Dropdown Menu */}
                          {isMenuOpen && (
                            <div className={s.menuDropdown}>
                              <button
                                onClick={handleEditPost}
                                className={s.menuButton}
                              >
                                <Edit2Outline />
                                EditPost
                              </button>
                              {/*=======================================================================================*/}
                              <button
                                onClick={onCloseOpenDeleteModal}
                                className={s.menuButton}
                              >
                                <TrashOutline />
                                Delete Post
                              </button>
                              {/*=======================================================================================*/}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
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
                                  {postDescription}
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
                        <div className={s.commentsContainer}>
                          <div className={s.captionWrapper}>
                            <Image
                              src="/User 07.jpg"
                              alt={'anotherUserName1'}
                              className={s.commentAvatar}
                              width={36}
                              height={36}
                            />
                            <div className={s.captionContent}>
                              <div className={s.textCaptionContent}>
                                <span className={s.commentUsername}>
                                  {userName}{' '}
                                  <span className={s.captionText}>
                                    {postDescription}
                                  </span>
                                </span>
                              </div>
                              <span
                                className={`${s.heartBeating} ${isLiked ? s.heartLiked : ''}`}
                                onClick={handleCountLikesPost}
                              >
                                <HeartOutline />
                              </span>
                            </div>
                          </div>
                          <div className={s.timestamp}>
                            <div>{formatDate(post.createdAt)}</div>
                            <div>Like: {likes}</div>
                            <div>Answer</div>
                          </div>
                        </div>
                        <div className={s.commentsContainer}>
                          <div className={s.captionWrapper}>
                            <Image
                              src="/User 18.jpg"
                              alt="anotherUserName2"
                              className={s.commentAvatar}
                              width={36}
                              height={36}
                            />
                            <div className={s.captionContent}>
                              <div className={s.textCaptionContent}>
                                <span className={s.commentUsername}>
                                  {userName}{' '}
                                  <span className={s.captionText}>
                                    {postDescription}
                                  </span>
                                </span>
                              </div>
                              <span
                                className={`${s.heartBeating} ${isLiked ? s.heartLiked : ''}`}
                                onClick={handleCountLikesPost}
                              >
                                <HeartOutline />
                              </span>
                            </div>
                          </div>
                          <div className={s.timestamp}>
                            <div>{formatDate(post.createdAt)}</div>
                            <div>Like: {likes}</div>
                            <div>Answer</div>
                          </div>
                        </div>
                        {/*{comments.map(comment => (*/}
                        {/*  <div key={comment.id} className={s.comment}>*/}
                        {/*    /!* для будущих комментов *!/*/}
                        {/*  </div>*/}
                        {/*))}*/}
                      </div>
                    </div>
                  </div>
                  <div className={s.footer}>
                    {/* Иконки действий */}
                    <div className={s.actions}>
                      <div className={s.actionsLeft}>
                        <button className={s.actionButton} aria-label="Like">
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

                    {/* Лайки */}
                    <div className={s.likes}>
                      <span className={s.likesCount}>{likes} Likes</span>
                    </div>
                    <div className={s.timeReal}>
                      <div>{timeReal}</div>
                    </div>

                    {/* Поле ввода комментария */}
                    {isAuthorized && (
                      <div className={s.inputWrapper}>
                        <input
                          type="text"
                          onChange={(e) => setNewComment(e.target.value)}
                          value={newComment}
                          placeholder="Add a Comment..."
                          className={s.input}
                        />
                        <Button
                          className={s.submitButton}
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
