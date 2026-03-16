'use client';

import { Dialog } from '@/shared/ui';
import s from '../PaymentDialogs.module.scss';

type PaymentSuccessDialogProps = {
  open: boolean;
  onCloseAction: () => void;
};

export const PaymentSuccessDialog = ({
  open,
  onCloseAction,
}: PaymentSuccessDialogProps) => {
  return (
    <Dialog
      open={open}
      title={'Success'}
      size={'sm'}
      confirmButtonText={'OK'}
      className={s.dialog}
      buttonsClass={s.successButtons}
      confirmButtonClass={s.successButton}
      buttonsMarginTop={'54px'}
      onClose={onCloseAction}
      onConfirmButtonClick={onCloseAction}
    >
      <p className={s.bodyText}>Payment was successful</p>
    </Dialog>
  );
};
