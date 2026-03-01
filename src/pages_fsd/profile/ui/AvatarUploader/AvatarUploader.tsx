'use client';
import { Button } from '@/shared/ui';
import { UploadModal } from './UploadModal';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';
import { AvatarPreview } from './AvatarPreview';
import { useAvatarUploader } from './useAvatarUploader';
import s from './AvatarUploader.module.scss';

export const AvatarUploader = ({
  currentAvatar,
}: {
  currentAvatar?: string | null;
}) => {
  const {
    isUploadOpen,
    setIsUploadOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    isUploading,
    isDeleting,
    handleUpload,
    handleDelete,
    handleCloseUpload,
  } = useAvatarUploader();

  return (
    <div className={s['avatar-section']}>
      <AvatarPreview
        currentAvatar={currentAvatar}
        onDelete={() => setIsDeleteOpen(true)}
        disabled={isDeleting}
      />

      <Button
        variant="outline"
        onClick={() => setIsUploadOpen(true)}
        className={s['profile-select-btn']}
      >
        Select Profile Photo
      </Button>

      <UploadModal
        open={isUploadOpen}
        onOpenChange={handleCloseUpload}
        onSave={handleUpload}
        isLoading={isUploading}
      />

      <ConfirmDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};
