'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { ImageListType } from 'react-images-uploading';

import s from './CreatePostDialog.module.scss';
import { ConfirmCloseDialog } from './ConfirmCloseDialog/ConfirmCloseDialog';
import { StepSelect } from './steps/StepSelect';
import { StepCrop } from './steps/StepCrop';
import { StepFilters } from './steps/StepFilters';
import { StepPublication } from './steps/StepPublication';

import { useCreateNewPostMutation } from '@/entities/post/api/postApi';
import { getCroppedFilteredImageBlob } from '../../lib/image';
import { FILTERS } from '@/entities/post/model/types/constant';
import { fileKey } from '../../lib/keys';
import {
  CreatePostStep,
  ImageEditsMap,
} from '@/entities/post/model/types/types';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/shared/lib/routes';
import { handleNetworkError } from '@/shared/lib';
import { useAppDispatch } from '@/shared/hooks';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export const CreatePostDialog = ({ open, onOpenChange }: Props) => {
  const [step, setStep] = useState<CreatePostStep>('select');

  const [images, setImages] = useState<ImageListType>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [edits, setEdits] = useState<ImageEditsMap>({});

  const [description, setDescription] = useState('');
  const [confirmClose, setConfirmClose] = useState(false);

  const dispatch = useAppDispatch();
  const [createNewPost, { isLoading }] = useCreateNewPostMutation();
  const router = useRouter();

  const hasChanges = images.length > 0 || description.trim().length > 0;

  const requestClose = () => {
    if (!hasChanges) {
      resetAll();
      onOpenChange(false);
      return;
    }
    setConfirmClose(true);
  };

  const resetAll = () => {
    setStep('select');
    setImages([]);
    setActiveIndex(0);
    setEdits({});
    setDescription('');
    setConfirmClose(false);
  };

  const goNext = () => {
    if (step === 'select') setStep('crop');
    else if (step === 'crop') setStep('filters');
    else if (step === 'filters') setStep('publication');
  };

  const goBack = () => {
    if (step === 'select') requestClose();
    else if (step === 'crop') setStep('select');
    else if (step === 'filters') setStep('crop');
    else if (step === 'publication') setStep('filters');
  };

  const title = useMemo(() => {
    if (step === 'select') return 'Add Photo';
    if (step === 'crop') return 'Cropping';
    if (step === 'filters') return 'Filters';
    return 'Publication';
  }, [step]);

  const publish = async () => {
    if (!images.length) return;
    if (isLoading) return;

    const formData = new FormData();

    const filtersArr: string[] = [];

    for (const item of images) {
      if (!item.file) continue;
      const key = fileKey(item.file);
      const edit = edits[key];

      const filterValue = edit?.filter ?? 'none';
      const cssFilter =
        FILTERS.find((f) => f.value === filterValue)?.css ?? 'none';

      let blob: Blob;
      if (item.data_url) {
        blob = await getCroppedFilteredImageBlob(
          item.data_url,
          edit?.croppedAreaPixels,
          item.file.type,
          cssFilter,
        );
      } else {
        blob = item.file;
      }

      const outFile = new File([blob], item.file.name, {
        type: item.file.type,
      });
      formData.append('files', outFile);
    }

    formData.append('description', description);
    formData.append(
      'filters',
      JSON.stringify(
        images.map((it) => {
          const key = it.file ? fileKey(it.file) : '';
          const edit = key ? edits[key] : undefined;
          return edit?.filter ?? 'none';
        }),
      ),
    );
    try {
      await createNewPost(formData).unwrap();

      toast.success('Post created');
      resetAll();
      onOpenChange(false);
      router.push(APP_ROUTES.ROOT);
    } catch (error: unknown) {
      handleNetworkError({ error, dispatch });
      toast.error('Upload error');
    }
  };

  const takeImage = (arg: ImageListType) => {
    setImages(arg);
    const next: ImageEditsMap = {};
    for (const it of arg) {
      if (it.file) {
        const k = fileKey(it.file);
        next[k] = edits[k] ?? {
          crop: { x: 0, y: 0 },
          zoom: 1,
          aspect: 1,
          filter: 'none',
        };
      }
    }
    setEdits(next);
    if (activeIndex >= arg.length) setActiveIndex(Math.max(0, arg.length - 1));
  };

  return (
    <>
      <Dialog.Root
        open={open}
        onOpenChange={(v) => (v ? onOpenChange(true) : requestClose())}
      >
        <Dialog.Portal>
          <Dialog.Overlay
            className={s.overlay}
            style={confirmClose ? { pointerEvents: 'none' } : undefined}
          />
          <Dialog.Content
            className={s.content}
            aria-describedby={undefined}
            style={confirmClose ? { pointerEvents: 'none' } : undefined}
          >
            <div className={s.body} data-step={step}>
              {step === 'select' && (
                <StepSelect
                  images={images}
                  setImages={takeImage}
                  onNext={goNext}
                  onRequestClose={requestClose}
                />
              )}

              {step === 'crop' && (
                <StepCrop
                  images={images}
                  setImages={takeImage}
                  edits={edits}
                  setEdits={setEdits}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                  onBack={goBack}
                  onNext={goNext}
                />
              )}

              {step === 'filters' && (
                <StepFilters
                  images={images}
                  edits={edits}
                  setEdits={setEdits}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                  onBack={goBack}
                  onNext={goNext}
                />
              )}

              {step === 'publication' && (
                <StepPublication
                  images={images}
                  edits={edits}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                  description={description}
                  setDescription={setDescription}
                  isLoading={isLoading}
                  onBack={goBack}
                  onPublish={publish}
                />
              )}
            </div>

            <Dialog.Title style={{ display: 'none' }}>{title}</Dialog.Title>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <ConfirmCloseDialog
        open={confirmClose}
        onOpenChange={setConfirmClose}
        onDiscard={() => {
          resetAll();
          onOpenChange(false);
        }}
        onSaveDraft={() => {
          toast.info('Draft saved (stub)');
          resetAll();
          onOpenChange(false);
        }}
        showSaveDraft={true}
      />
    </>
  );
};
