'use client';
import { useEffect, useState } from 'react';
import * as Toast from '@radix-ui/react-toast';
import styles from './PopUp.module.scss';
import Close from '@/shared/ui/icons/Close';
import { changeError, selectError } from '@/shared/api/baseSlice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';

export const PopUp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const error = useAppSelector(selectError);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!error) {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
    const id = setTimeout(() => {
      dispatch(changeError({ error: '' }));
      setIsOpen(false);
    }, 2000);

    return () => clearTimeout(id);
  }, [error, dispatch]);

  return (
    <Toast.Provider swipeDirection={'right'}>
      <Toast.Root
        className={styles.Root}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <Toast.Title>Ошибка</Toast.Title>
        <Toast.Description>{error}</Toast.Description>
        <Toast.Close className={styles.Action} asChild>
          <Close />
        </Toast.Close>
      </Toast.Root>
      <Toast.Viewport className={styles.Viewport} />
    </Toast.Provider>
  );
};
