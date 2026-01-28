'use client';

import { Modal } from '@/shared/ui/modal/Modal';
import { Button } from '@/shared/ui';
import s from './EmailSentModal.module.scss';

type Props = {
  open: boolean;
  email: string;
  onCloseAction: () => void;
};

export const EmailSentModal = ({ open, email, onCloseAction }: Props) => {
  return (
    <Modal
      open={open}
      showCloseButton={true}
      title={'Email sent'}
      size={'sm'}
      onClose={onCloseAction}
    >
      <div className={s.modalContent}>
        <p className={s.modalText}>
          We have sent a link to confirm your email to{' '}
          <strong className={s.emailText}>{email}</strong>. This link will
          expire in one hour. Don&apos;t miss out.
        </p>
        <Button
          className={s.buttonModal}
          variant={'primary'}
          size={'sm'}
          onClick={onCloseAction}
          fullWidth
        >
          OK
        </Button>
      </div>
    </Modal>
  );
};
