'use client';

import { useState } from 'react';
import s from './StripeAutoRenewalModal.module.scss';
import { CloseOutline } from '@/shared/ui/icons';
import { Button, Checkbox } from '@/shared/ui';

type Props = {
  open: boolean;
  onCloseAction: () => void;
  onConfirmAction: () => void | Promise<void>;
  isLoading?: boolean;
};

export const StripeAutoRenewalModal = ({
  open,
  onCloseAction,
  onConfirmAction,
  isLoading = false,
}: Props) => {
  const [isChecked, setIsChecked] = useState(false);

  if (!open) {
    return null;
  }

  const handleConfirm = async () => {
    if (!isChecked || isLoading) return;
    await onConfirmAction();
  };

  return (
    <div className={s.overlay} onClick={onCloseAction}>
      <div
        className={s.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={s.modalHeader}>
          <h3 className={s.title}>Create payment</h3>
          <button className={s.closeEditPost} onClick={onCloseAction}>
            <CloseOutline />
          </button>
        </div>

        <p className={s.text}>
          Auto-renewal will be enabled with this payment. You can disable it
          anytime in your profile settings.
        </p>
        <div className={s.actions}>
          <Checkbox
            label="I аgree"
            checked={isChecked}
            onChangeAction={(checked: boolean) => setIsChecked(checked)}
          />
          <Button
            size={'sm'}
            className={s.okButton}
            onClick={handleConfirm}
            disabled={!isChecked || isLoading}
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};
