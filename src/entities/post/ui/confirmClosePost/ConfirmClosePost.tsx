'use client';
import { createPortal } from 'react-dom';
import s from './ConfirmClosePost.module.scss';
import { Button } from '@/shared/ui';
import { CloseOutline } from '@/shared/ui/icons';

export const ConfirmClosePost = ({
  isOpen,
  onCloseAction,
  onConfirmAction,
}: {
  isOpen: boolean;
  onCloseAction: () => void;
  onConfirmAction: () => void;
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className={s.confirmationOverlay} onClick={onCloseAction}>
      <div
        className={s.confirmationModal}
        onClick={(e) => e.stopPropagation()}
        style={{ pointerEvents: 'auto' }}
      >
        <div className={s.confirmationHeader}>
          <h1 className={s.confirmationTitle}>Close Post</h1>
          <button className={s.closeEditPost} onClick={onCloseAction}>
            <CloseOutline />
          </button>
        </div>
        <div className={s.confirmationContent}>
          <p>
            Do you really want to close the edition of the publication?
            <br />
            If you close changes won&apos;t be saved
          </p>
        </div>
        <div className={s.confirmationActions}>
          <Button
            onClick={onConfirmAction}
            className={s.confirmationButton}
            variant="outline"
            size="sm"
          >
            Yes
          </Button>
          <Button
            onClick={onCloseAction}
            className={s.confirmationButton}
            variant="primary"
            size="sm"
          >
            No
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
