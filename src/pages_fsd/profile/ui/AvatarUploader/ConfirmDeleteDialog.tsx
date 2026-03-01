'use client';

import { Modal, Button, Typography } from '@/shared/ui';
import s from './AvatarUploader.module.scss';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
};

export const ConfirmDeleteDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: Props) => {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      title="Delete Photo"
      size="delete"
      className={s['confirm-modal']}
      showCloseButton={true}
    >
      <Typography
        variant="regular_text_16"
        color="primary"
        className={s.message}
      >
        Do you really want to delete your profile photo?
      </Typography>

      <div className={s.actions}>
        <Button
          variant="outline"
          onClick={handleConfirm}
          className={s['actions-btn']}
          disabled={isLoading}
        >
          {isLoading ? 'Deleting...' : 'Yes'}
        </Button>
        <Button
          variant="primary"
          onClick={handleCancel}
          className={s['actions-btn']}
          disabled={isLoading}
        >
          No
        </Button>
      </div>
    </Modal>
  );
};
