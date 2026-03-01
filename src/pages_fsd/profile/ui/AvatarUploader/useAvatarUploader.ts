import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch } from '@/shared/hooks';
import { handleNetworkError } from '@/shared/lib';
import {
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
} from '@/pages_fsd/profile/api/profileApi';
import { getUserProfileRoute } from '@/shared/lib/routes';

export const useAvatarUploader = () => {
  const router = useRouter();

  const params = useParams<{ id: string }>();
  const id = params.id;

  const dispatch = useAppDispatch();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();
  const [deleteAvatar, { isLoading: isDeleting }] = useDeleteAvatarMutation();

  const handleCloseUpload = () => {
    setIsUploadOpen(false);
    if (id) {
      router.push(getUserProfileRoute(id));
    } else {
      console.error('ID not found in URL params');
    }
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file, 'avatar.jpeg');
    try {
      await uploadAvatar(formData).unwrap();
      handleCloseUpload();
    } catch (err) {
      handleNetworkError({ error: err, dispatch });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAvatar().unwrap();
      setIsDeleteOpen(false);
    } catch (err) {
      handleNetworkError({ error: err, dispatch });
    }
  };

  return {
    isUploadOpen,
    setIsUploadOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    isUploading,
    isDeleting,
    handleUpload,
    handleDelete,
    handleCloseUpload,
  };
};
