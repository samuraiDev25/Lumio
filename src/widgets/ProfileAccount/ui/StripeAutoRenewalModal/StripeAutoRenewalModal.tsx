'use client';

import { useState } from 'react';
import { Checkbox, Dialog } from '@/shared/ui';
import s from '../PaymentDialogs.module.scss';

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

  const handleConfirm = async () => {
    if (!isChecked || isLoading) return;
    await onConfirmAction();
  };

  return (
    <Dialog
      open={open}
      title={'Create payment'}
      size={'sm'}
      className={s.dialog}
      confirmButtonText={'OK'}
      confirmButtonClass={s.singleButton}
      buttonsMarginTop={'18px'}
      confirmButtonDisabled={!isChecked || isLoading}
      buttonsClass={s.stripeFooter}
      footerContent={
        <Checkbox
          className={s.checkbox}
          label="I agree"
          checked={isChecked}
          onChangeAction={(checked: boolean) => setIsChecked(checked)}
        />
      }
      onClose={onCloseAction}
      onConfirmButtonClick={handleConfirm}
    >
      <div className={s.stripeContent}>
        <p className={s.bodyText}>
          Auto-renewal will be enabled with this payment. You can disable it
          anytime in your profile settings.
        </p>
      </div>
    </Dialog>
  );
};
