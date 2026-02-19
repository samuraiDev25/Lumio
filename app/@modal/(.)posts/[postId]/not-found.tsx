'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';
import s from '../../../../src/entities/post/ui/PostModal/PostModal.module.scss';
import { CloseOutline } from '@/shared/ui/icons';
import { Button } from '@/shared/ui';
import Image from 'next/image';

export default function NotFound() {
  const router = useRouter();

  const close = () => router.back();

  return (
    <Dialog.Root open={true} onOpenChange={(open) => !open && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className={s.overlay} />
        <Dialog.Content className={s.content}>
          <Dialog.Title className={s.dialogTitle}>Post not found</Dialog.Title>

          <Dialog.Close className={s.closeButton}>
            <CloseOutline />
          </Dialog.Close>

          <div
            style={{
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: '80px', // Кастыль
            }}
          >
            <Image
              src="/404/imgNotFound.jpg"
              alt="404 Not Found"
              width={800}
              height={400}
              priority
            />
            <p>Пост не найден или был удалён.</p>

            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <Button variant="outline" onClick={close}>
                Go back
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
