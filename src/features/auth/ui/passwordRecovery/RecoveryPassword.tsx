'use client';

import { Button, Card, Dialog, TextField } from '@/shared/ui';
import s from './RecoveryPassword.module.scss';
import Link from 'next/link';
import { AUTH_ROUTES } from '@/shared/lib/routes';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRecoveryPasswordMutation } from '@/entities/auth/api/authApi';
// import dynamic from 'next/dynamic';
import { handleNetworkError } from '@/shared/lib';
import {
  recoveryPasswordSchema,
  RecoveryPasswordType,
} from '@/features/auth/model/validation';
import { changeError } from '@/shared/api/baseSlice';
import { useAppDispatch } from '@/shared/hooks';

// const ReCAPTCHA = dynamic(() => import('react-google-recaptcha'), {
//   ssr: false,
// });

export const RecoveryPassword = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recoveryPassword] = useRecoveryPasswordMutation();
  const dispatch = useAppDispatch();

  const {
    watch,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RecoveryPasswordType>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(recoveryPasswordSchema),
    mode: 'onBlur',
  });
  const value = watch().email;

  const handleFormSubmit: SubmitHandler<RecoveryPasswordType> = async (
    data,
  ) => {
    if (!recaptchaToken) {
      dispatch(
        changeError({ error: 'Пожалуйста, подтвердите что вы не робот' }),
      );

      return;
    }

    const obj = {
      email: data.email,
      recaptcha: recaptchaToken,
      baseUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/auth/recovery/create-password`,
    };

    try {
      await recoveryPassword(obj).unwrap();
      setModalOpen(true);
    } catch (error: unknown) {
      handleNetworkError({ error, dispatch });
    }
  };

  const closeHandler = () => {
    setModalOpen(false);
    reset();
  };

  return (
    <div className={s.box}>
      <Card className={s.card}>
        <h1 className={s.title}>Forgot Password</h1>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <TextField
            {...register('email')}
            errorMessage={errors.email && errors.email.message}
            label={'Email'}
            placeholder={'Epam@epam.com'}
            type={'email'}
            autoComplete={'email'}
          />
          <Dialog
            size={'sm'}
            title={'Email sent'}
            confirmButtonText={'OK'}
            onClose={closeHandler}
            onConfirmButtonClick={closeHandler}
            open={modalOpen}
            className={s.dialog}
          >
            <p className={s.modalText}>
              We have sent a link to confirm your email to {value}
            </p>
          </Dialog>
          <p className={s.text}>
            Enter your email address and we will send you further
            instructions{' '}
          </p>
          <div className={s.buttonBox}>
            <Button
              disabled={!!errors.email || !recaptchaToken}
              type={'submit'}
              fullWidth
            >
              Send Link
            </Button>
            <Button variant={'secondary'} fullWidth asChild>
              <Link href={AUTH_ROUTES.SIGN_IN}>Back to Sign In</Link>
            </Button>
          </div>
          <div data-theme={'dark'}></div>
        </form>
      </Card>
    </div>
  );
};
