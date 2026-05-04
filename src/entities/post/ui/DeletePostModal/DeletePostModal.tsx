'use client';

import { Button, Modal } from '@/shared/ui';
import { useDeletePostMutation } from '@/entities/post/api/postApi';
import { toast } from 'react-toastify';
import { handleNetworkError } from '@/shared/lib';
import { useAppDispatch } from '@/shared/hooks';
import s from './DeletePostModal.module.scss';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/shared/lib/routes';

type DeletePostModalProps = {
  isOpenModal: boolean;
  onCloseModalAction: () => void;
  postId: string;
};

export const DeletePostModal = ({
  postId,
  isOpenModal,
  onCloseModalAction,
}: DeletePostModalProps) => {
  const dispatch = useAppDispatch();
  const [deletePost] = useDeletePostMutation();
  const router = useRouter();

  const handleDeletePost = async () => {
    try {
      await deletePost(postId).unwrap();
      onCloseModalAction();
      toast.success('Post deleted');
      router.push(APP_ROUTES.ROOT);
    } catch (error: unknown) {
      handleNetworkError({ error, dispatch });
      toast.error('Something went wrong while deleting post');
    }
  };
  return (
    <Modal
      open={isOpenModal}
      title={'Delete Post'}
      size={'sm'}
      onClose={onCloseModalAction}
    >
      <div className={s.closeMainWrapper}>
        <div className={s.closeMainTitle}>
          Are you sure you want to delete this post?
        </div>
        <div className={s.closeDeleteBtnWrapper}>
          <Button
            variant={'outline'}
            onClick={handleDeletePost}
            className={s.deleteBtn}
          >
            Yes
          </Button>
          <Button onClick={onCloseModalAction} className={s.deleteBtn}>
            No
          </Button>
        </div>
      </div>
    </Modal>
  );
};
