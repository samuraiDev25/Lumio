'use client';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { useState } from 'react';
import { useCreateNewPostMutation } from '@/entities/post/api/postApi';
import { Modal } from '@/shared/ui';

export const CreateNewPost = () => {
  const [images, setImages] = useState<ImageListType>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [createPost, { isLoading }] = useCreateNewPostMutation();

  const onChange = (imageList) => {
    console.log(imageList);
    setImages(imageList);
  };

  const handleSubmit = async () => {
    if (!images.length) return;

    const formData = new FormData();

    images.forEach((image) => {
      if (image.file) {
        /*   const first = {
          name: 'Roman',
          id: 61,
          description: 'Мой первый пост',
          createdAt: '2025-12-26T13:39:48.953Z',
          userId: 44,
          postFiles: [
            {
              id: 248,
              url: 'https://lumio-files-photo.storage.yandexcloud.net/content/posts/62/62_image_...',
              postId: 62,
            },
          ],
        };
*/
        console.log(image.file);
        formData.append('files', image.file);
      }
    });
    console.log(formData.getAll('files'));
    formData.append('description', 'My post');
    // console.log('Not create new post');
    try {
      // console.log('Create new post');
      await createPost(formData).unwrap();
      console.log('Create new post11111');
      setImages([]);
      setIsOpen(false);
    } catch (e) {
      console.error('Upload error', e);
    }
  };

  return (
    <Modal
      title="Add Photo"
      onClose={() => setIsOpen(false)}
      size="md"
      open={isOpen}
    >
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        dataURLKey="data_url"
      >
        {({ imageList, onImageUpload, onImageRemove, dragProps }) => (
          <div>
            <button onClick={onImageUpload} {...dragProps}>
              Click or Drop here
            </button>

            {imageList.map((image, index) => (
              <div key={index}>
                <img src={image.data_url} alt="" width="100" />
                <button onClick={() => onImageRemove(index)}>Remove</button>
              </div>
            ))}

            <button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Uploading...' : 'Publish'}
            </button>
          </div>
        )}
      </ImageUploading>
    </Modal>
  );
};
