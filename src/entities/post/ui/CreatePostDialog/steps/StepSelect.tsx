'use client';

import ImageUploading, { ImageListType } from 'react-images-uploading';
import { Button } from '@/shared/ui/button/Button';
import { toast } from 'react-toastify';
import s from '../CreatePostDialog.module.scss';

import { validateImageFile } from '../../../lib/image';
import {
  ALLOWED_TYPES,
  INVALID_FILE_TEXT,
  MAX_FILE_SIZE_BYTES,
  MAX_FILES,
} from '@/entities/post/model/types/constant';

type Props = {
  images: ImageListType;
  setImages: (list: ImageListType) => void;
  onNext: () => void;
  onRequestClose?: () => void;
};

export const StepSelect = ({
  images,
  setImages,
  onNext,
  onRequestClose,
}: Props) => {
  const onChange = (imageList: ImageListType) => {
    for (const item of imageList) {
      if (item.file) {
        const ok = validateImageFile(
          item.file,
          MAX_FILE_SIZE_BYTES,
          ALLOWED_TYPES,
        );
        if (!ok) {
          toast.error(INVALID_FILE_TEXT);
          return;
        }
      }
    }
    setImages(imageList);
    if (imageList.length > 0) onNext();
  };

  return (
    <>
      <div className={s.headerBar}>
        <div className={s.headerTitle}>Add Photo</div>

        <button
          className={s.linkBtn}
          type="button"
          onClick={onNext}
          disabled={images.length === 0}
        >
          Next
        </button>
      </div>

      <div className={s.body}>
        <div className={s.selectBody}>
          <div className={s.placeholderBox}>
            <svg className={s.placeholderIcon} viewBox="0 0 24 24" fill="none">
              <path
                d="M4 5.5C4 4.67 4.67 4 5.5 4h13c.83 0 1.5.67 1.5 1.5v13c0 .83-.67 1.5-1.5 1.5h-13C4.67 20 4 19.33 4 18.5v-13Z"
                stroke="white"
                strokeWidth="1.5"
                opacity="0.9"
              />
              <path
                d="M8.2 14.2 10.4 12l2.2 2.2 3.2-3.2L20 15.2"
                stroke="white"
                strokeWidth="1.5"
                strokeLinejoin="round"
                opacity="0.9"
              />
              <circle cx="9" cy="9" r="1.2" fill="white" opacity="0.9" />
            </svg>
          </div>

          <ImageUploading
            multiple
            value={images}
            onChange={onChange}
            maxNumber={MAX_FILES}
            acceptType={['jpg', 'jpeg', 'png']}
            dataURLKey="data_url"
          >
            {({ onImageUpload }) => (
              <div className={s.selectActions}>
                <Button className={s.confirmActionsBtn} onClick={onImageUpload}>
                  Select from Computer
                </Button>
                <Button
                  className={s.confirmActionsBtn}
                  variant="outline"
                  onClick={() => toast.info('Draft not implemented yet')}
                >
                  Open Draft
                </Button>
              </div>
            )}
          </ImageUploading>
        </div>
      </div>
    </>
  );
};
