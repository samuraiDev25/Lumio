'use client';

import { Button, Modal } from '@/shared/ui';
import { ChangeEvent, useState } from 'react';
import s from './Create.module.scss';

export function Create() {
  const [isOpen, setIsOpen] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const closeModalFn = () => {
    setIsOpen(false);
  };

  const MAX_FILE_SIZE = 20 * 1024 * 1024;

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const isValidType = ['image/jpeg', 'image/png'].includes(selectedFile.type);
    if (!isValidType) {
      console.error('Only JPEG/PNG allowed');
      e.target.value = '';
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      console.error('Max file size is 20MB');
      e.target.value = '';
      return;
    }

    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  return (
    <>
      <Modal
        title={'Add Photo'}
        onClose={closeModalFn}
        size={'md'}
        open={isOpen}
      >
        <div className={s.create_publication_modal}>
          <div className={s.create_publication}>
            <div className={s.image_preview}>
              <input
                type="file"
                src="https://lumio.su"
                accept="image/jpeg, image/png"
                style={{ display: 'none' }}
                onChange={onFileChange}
              />
            </div>
            <div className={s.create_btns}>
              <Button className={s.select_btn}>Select from Computer</Button>
              <Button className={s.open_btn} variant={'outline'}>
                Open Draft
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
