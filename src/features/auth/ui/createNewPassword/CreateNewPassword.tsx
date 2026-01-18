'use client';

import s from './CreateNewPassword.module.scss';
import { Button, Card, TextField } from '@/shared/ui';
import { EyeOffOutline, EyeOutline } from '@/shared/ui/icons';
import { useBoolean } from 'react-use';
import { SubmitHandler, useForm } from 'react-hook-form';
import { newPasswordSchema, NewPasswordType } from '../../model/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { handleNetworkError } from '@/shared/lib';
import { AUTH_ROUTES } from '@/shared/lib/routes';
import { useCallback } from 'react';
import { useCreateNewPasswordMutation } from '@/features/auth/api/authApi';
import { useAppDispatch } from '@/shared/hooks';

export const CreateNewPassword = () => {
  const [showPassword, toggleShowPassword] = useBoolean(false);
  const [showConfirmedPassword, toggleShowConfirmedPassword] =
    useBoolean(false);
  const [createNewPassword] = useCreateNewPasswordMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    watch,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewPasswordType>({
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
    resolver: zodResolver(newPasswordSchema),
    mode: 'onChange',
  });

  const code = searchParams?.get('code') || '';

  if (!code) {
    redirect(AUTH_ROUTES.EXPIRED_LINK);
  }

  const handleFormSubmit: SubmitHandler<NewPasswordType> = useCallback(
    async (data) => {
      alert('New paswword is created');

      const obj = {
        newPassword: data.password,
        recoveryCode: code,
      };

      try {
        await createNewPassword(obj).unwrap();
        router.push(AUTH_ROUTES.SIGN_IN);
      } catch (error: unknown) {
        handleNetworkError({ error, dispatch });
      }
    },
    [createNewPassword, router, dispatch, code],
  );

  return (
    <div className={s.box}>
      <Card className={s.card}>
        <span className={s.title}>Create New Password</span>
        <form className={s.form} onSubmit={handleSubmit(handleFormSubmit)}>
          <TextField
            className={s.password}
            {...register('password')}
            errorMessage={errors.password && errors.password.message}
            type={showPassword ? 'text' : 'password'}
            placeholder={'••••••••••'}
            label={'New password'}
            iconEnd={showPassword ? <EyeOutline /> : <EyeOffOutline />}
            onEndIconClick={toggleShowPassword}
            required
          />
          <TextField
            className={s.password}
            {...register('passwordConfirmation')}
            errorMessage={
              errors.passwordConfirmation && errors.passwordConfirmation.message
            }
            type={showConfirmedPassword ? 'text' : 'password'}
            placeholder={'••••••••••'}
            label={'Password confirmation'}
            iconEnd={showConfirmedPassword ? <EyeOutline /> : <EyeOffOutline />}
            onEndIconClick={toggleShowConfirmedPassword}
            required
          />
          <span
            className={s.text}
          >{`Your password must be between 6 and 20 characters`}</span>

          <Button variant={'primary'} className={s.password} type={'submit'}>
            Create new password
          </Button>
        </form>
      </Card>
    </div>
  );
};
