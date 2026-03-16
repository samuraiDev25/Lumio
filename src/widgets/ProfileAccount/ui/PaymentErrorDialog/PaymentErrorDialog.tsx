'use client';

import { Dialog } from '@/shared/ui';
import s from '../PaymentDialogs.module.scss';

type PaymentErrorDialogProps = {
  open: boolean;
  onCloseAction: () => void;
};

export const PaymentErrorDialog = ({
  open,
  onCloseAction,
}: PaymentErrorDialogProps) => {
  return (
    <Dialog
      open={open}
      title={'Error'}
      size={'sm'}
      confirmButtonText={'Back to payment'}
      className={s.dialog}
      buttonsClass={s.successButtons}
      confirmButtonClass={s.successButton}
      buttonsMarginTop={'54px'}
      onClose={onCloseAction}
      onConfirmButtonClick={onCloseAction}
    >
      <p className={s.bodyText}>Transaction failed, please try again</p>
    </Dialog>
  );
};
