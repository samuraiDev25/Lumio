'use client';

import { ReactNode, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import s from './PostModal.module.scss';
import { CloseOutline } from '@/shared/ui/icons';
import { Post } from '@/entities/post/model/types/postApi.types';
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
import { useRouter } from 'next/navigation';

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

  const [isDeletePost, setIsDeletePost] = useState(false);

  const [isClosePost, setIsClosePost] = useState(false);
  const [likes, setLikes] = useState<number>(likesPost);
  const [isLiked, setIsLiked] = useState<boolean>(false);
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
  const router = useRouter();

  // Определяем, откуда пришел пользователь для правильного редиректа
  const getRedirectPath = () => {
    const referer = document.referrer || '';
    
    // Если пришли по прямой ссылке (URL содержит postId)
    if (typeof window !== 'undefined' && window.location.search.includes('postId=')) {
      return `/profile/${currentUser?.userId || ''}`;
    }
    
    // Если пришли со страницы профиля
    if (referer.includes('/profile')) {
      return `/profile/${currentUser?.userId || ''}`;
    }
    
    // Если пришли с главной страницы
    return '/';
  };

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
    // Выполняем редирект на нужную страницу
    const redirectPath = getRedirectPath();
    router.push(redirectPath);
    setOpen(false);
  };
  const { currentIndex, nextImage, prevImage, selectImage } =
    useImageNavigation(initialImageIndex ?? 0, images.length);

  const onCloseOpenDeleteModal = () => {
    setIsMenuOpen(false);
    setIsDeletePost(true);
  };

  const handleCountLikesPost = () => {
    setLikes((prev) => prev + 1);
    setIsLiked((prev) => !prev);
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
                        <CommentItem
                          userName={'anotherUserName1'}
                          avatarUrl={'/User 07.jpg'}
                          text={
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, metus eu tincidunt consequat, ' +
                            'metus purus tincidunt metus, vel gravida metus metus vel risus.'
                          }
                          createdAt={post.createdAt}
                          likes={12}
                          isLiked={false}
                          onLikeAction={handleCountLikesPost}
                        />
                        <CommentItem
                          userName={'anotherUserName2'}
                          avatarUrl={'/User 18.jpg'}
                          text={
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, metus eu tincidunt consequat'
                          }
                          createdAt={post.createdAt}
                          likes={5}
                          isLiked={false}
                          onLikeAction={handleCountLikesPost}
                        />
                      </div>
                    </div>
                  </div>
                  <PostActions likes={likes} isAuthorized={isAuthorized} />
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
