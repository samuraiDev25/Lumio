'use client';

import { useRef, useState, ChangeEvent } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { Modal, Button } from '@/shared/ui';
import { ImageOutline } from '@/shared/ui/icons';
import { getCroppedImageBlob } from './cropImage';
import s from './AvatarUploader.module.scss';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (file: File) => void;
  isLoading?: boolean;
};

export const UploadModal = ({
  open,
  onOpenChange,
  onSave,
  isLoading = false,
}: Props) => {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const closeAll = () => {
    setImage(null);
    setError(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    onOpenChange(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
    const isValidSize = file.size <= 10 * 1024 * 1024;

    if (!isValidType || !isValidSize) {
      setError('The photo must be less than 10 Mb and have JPEG or PNG format');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!image || !croppedAreaPixels) return;

    try {
      const blob = await getCroppedImageBlob(
        image,
        croppedAreaPixels,
        'image/jpeg',
      );

      const file = new File([blob], 'avatar.jpeg', { type: 'image/jpeg' });

      onSave(file);
    } catch (e) {
      console.error('Failed to crop image:', e);
      setError('Failed to process image. Please try another one.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={closeAll}
      title="Add a Profile Photo"
      size="md"
      showCloseButton={true}
      className={s['upload-modal-custom']}
    >
      <div className={s['modal-body']}>
        {error && <div className={s['error-banner']}>{error}</div>}

        {!image ? (
          <>
            <div className={s['modal-photo-placeholder']}>
              <ImageOutline className={s['modal-photo-icon']} />
            </div>

            <Button
              onClick={() => fileInputRef.current?.click()}
              className={s['modal-select-btn']}
            >
              Select from Computer
            </Button>

            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
            />
          </>
        ) : (
          <div className={s['crop-container']}>
            <div className={s['cropper-frame']}>
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
              />
            </div>

            <div className={s['modal-footer']}>
              <Button
                variant="primary"
                onClick={handleSave}
                className={s['save-btn']}
                disabled={isLoading}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
