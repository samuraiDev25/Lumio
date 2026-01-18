'use client';

import { Button, Card, Dialog, TextField } from '@/shared/ui';
import s from './PasswordRecovery.module.scss';
import Link from 'next/link';
import { AUTH_ROUTES } from '@/shared/lib/routes';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { handleNetworkError } from '@/shared/lib';
import {
  recoveryPasswordSchema,
  RecoveryPasswordType,
} from '@/features/auth/model/validation';
import { changeError } from '@/shared/api/baseSlice';
import { useAppDispatch } from '@/shared/hooks';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useRecoveryPasswordMutation } from '@/features/auth/api/authApi';

export const PasswordRecovery = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
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
    mode: 'onChange',
  });
  const value = watch().email;

  const handleFormSubmit: SubmitHandler<RecoveryPasswordType> = async (
    data,
  ) => {
    if (!executeRecaptcha) {
      dispatch(
        changeError({
          error: 'reCAPTCHA ещё не инициализировалась, попробуйте позже',
        }),
      );
      return;
    }

    try {
      const token = await executeRecaptcha();
      setRecaptchaToken(token);

      if (!token) {
        dispatch(
          changeError({ error: 'Пожалуйста, подтвердите что вы не робот' }),
        );
        return;
      }

      const obj = {
        email: data.email,
        recaptchaToken: token,
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}api/v1/auth/new-password`,
      };
      await recoveryPassword(obj).unwrap();
      setModalOpen(true);
    } catch (error: unknown) {
      handleNetworkError({ error, dispatch });
    }
  };

  const closeHandler = () => {
    setModalOpen(false);
    reset();
    setRecaptchaToken(null);
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
          <p className={s.introText}>
            The link has been sent by email.
            <br /> If you don’t receive an email send link again
          </p>
          <div className={s.buttonBox}>
            <Button
              disabled={!!errors.email}
              type={'submit'}
              className={s.btnLink1}
            >
              Send Link
            </Button>
            <Button variant={'link'} asChild className={s.btnLink2}>
              <Link href={AUTH_ROUTES.SIGN_IN}>Back to Sign In</Link>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
