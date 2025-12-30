import { Button, Modal } from '@/shared/ui';

import s from './Dialog.module.scss';
import { clsx } from 'clsx';
import { CSSProperties, FC } from 'react';
import { ModalProps } from '@/shared/ui/modal/Modal';
import { ButtonVariant } from '@/shared/ui/button/Button';

export type DialogProps = {
  cancelButtonText?: string;
  confirmButtonText?: string;
  invertButtons?: boolean;
  onCancelButtonClick?: () => void;
  onConfirmButtonClick: () => void;
  buttonsClass?: string;
  buttonsMarginTop?: CSSProperties['marginTop'];
} & ModalProps;

export const Dialog: FC<DialogProps> = ({
  cancelButtonText,
  children,
  confirmButtonText,
  invertButtons = true,
  onConfirmButtonClick,
  onCancelButtonClick,
  buttonsClass,
  buttonsMarginTop,
  ...rest
}) => {
  const { onClose } = rest;
  const showCancelButton = !!cancelButtonText;

  const handleConfirmButtonClick = () => {
    onConfirmButtonClick();
  };

  const handleCancelButtonClick = () => {
    if (onCancelButtonClick) {
      onCancelButtonClick();
    } else {
      onClose?.();
    }
  };

  const classnames = {
    buttonsBox: clsx(
      s.buttonsBox,
      showCancelButton && s.hasCancelButton,
      buttonsClass,
    ),
    button: s.button,
  };

  const confirmButtonVariant: ButtonVariant = getConfirmButtonVariant(
    invertButtons,
    showCancelButton,
  );
  const cancelButtonVariant: ButtonVariant = invertButtons
    ? 'primary'
    : 'outline';

  return (
    <Modal onClose={handleCancelButtonClick} {...rest}>
      {children}
      <div
        style={{ marginTop: buttonsMarginTop }}
        className={classnames.buttonsBox}
      >
        {
          <Button
            onClick={handleConfirmButtonClick}
            variant={confirmButtonVariant}
            className={classnames.button}
          >
            {confirmButtonText}
          </Button>
        }
        {showCancelButton && (
          <Button
            onClick={handleCancelButtonClick}
            variant={cancelButtonVariant}
            className={classnames.button}
          >
            {cancelButtonText}
          </Button>
        )}
      </div>
    </Modal>
  );
};

const getConfirmButtonVariant = (
  invertButtons: boolean,
  showCancelButton: boolean,
): ButtonVariant => {
  if (showCancelButton) {
    if (invertButtons) {
      return 'outline';
    }
  }

  return 'primary';
};
