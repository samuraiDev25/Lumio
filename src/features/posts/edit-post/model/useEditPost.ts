import { useState } from 'react';
import { toast } from 'react-toastify';
import { useUpdatePostUserMutation } from '@/entities/post/api/postApi';
import { handleNetworkError } from '@/shared/lib';
import { useAppDispatch } from '@/shared/hooks';
import { SignUpType } from '@/features/auth/model/validation';

export const useEditPost = (postId: string, initialDescription: string) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(initialDescription);
  const [updatePost] = useUpdatePostUserMutation();
  const dispatch = useAppDispatch();

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setDescription(initialDescription);
  };

  const saveEdit = async () => {
    const previousDescription = initialDescription;
    try {
      setIsEditing(false);

      await updatePost({
        postId,
        description,
      }).unwrap();
    } catch (error) {
      setDescription(previousDescription);
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

  const hasUnsavedChanges = () => {
    return description !== initialDescription;
  };

  return {
    isEditing,
    description,
    startEditing,
    cancelEditing,
    saveEdit,
    setDescription,
    hasUnsavedChanges,
  };
};
// const handleEditPost = () => {
//   setIsEditing(true);
//   setIsMenuOpen(false);
// };
// const handleSaveEdit = async () => {
//   const previousDescription = post.description;
//   try {
//     // Оптимистично обновляем UI
//     setIsEditing(false);
//
//     // Отправляем запрос
//     await updatePost({
//       postId: post.id,
//       description: postDescription,
//     }).unwrap();
//   } catch (error) {
//     // В случае ошибки возвращаем предыдущее значение
//     setPostDescription(previousDescription || '');
//     handleNetworkError({
//       error,
//       dispatch,
//       handle400Error: (error) => {
//         error.errorsMessages?.forEach((m) => {
//           if (m.field) {
//             console.error(m.field as keyof SignUpType, {
//               type: 'server',
//               message: m.message,
//             });
//           }
//         });
//       },
//       handle429Error: () => {
//         toast.error('Too many requests. Try again later.');
//       },
//       handle500Error: () => {
//         toast.error('Internal server error');
//       },
//       handleUnknownError: () => {
//         toast.error('Unexpected error');
//       },
//     });
//   }
// };
// Функция для закрытия редактирования с подтверждением
// const handleCloseEditing = () => {
//   if (postDescription !== (post.description || '')) {
//     // Если есть несохраненные изменения, показываем подтверждение
//     setIsClosePost(true);
//   } else {
//     // Если изменений нет, просто закрываем
//     setIsEditing(false);
//   }
// };
