'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/shared/ui/button/Button';
import s from '../CreatePostDialog.module.scss';
import { CLOSE_CONFIRM_TEXT } from '@/entities/post/model/types/constant';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  onDiscard: () => void;
  onSaveDraft?: () => void;
  showSaveDraft?: boolean;
};

export const ConfirmCloseDialog = ({
  open,
  onOpenChange,
  onDiscard,
  onSaveDraft,
  showSaveDraft = true,
}: Props) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={s.confirmOverlay} />
        <Dialog.Content className={s.confirmBox} aria-describedby={undefined}>
          <div
            className={s.headerBar}
            style={{ gridTemplateColumns: '1fr 56px' }}
          >
            <div style={{ paddingLeft: 12, fontWeight: 600 }}>Close</div>
            <Dialog.Close className={s.iconTopBtn} aria-label="Close">
              ✕
            </Dialog.Close>
          </div>

          <div className={s.confirmBody}>
            <div className={s.confirmText}>{CLOSE_CONFIRM_TEXT}</div>

            <div className={s.confirmActions}>
              <Button
                className={s.confirmActionsBtn}
                variant="outline"
                onClick={onDiscard}
              >
                Discard
              </Button>

              {showSaveDraft && (
                <Button className={s.confirmActionsBtn} onClick={onSaveDraft}>
                  Save draft
                </Button>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
