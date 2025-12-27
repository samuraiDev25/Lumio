'use client';

import s from './LoginForm.module.scss';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, TextField } from '@/shared/ui';
import Link from 'next/link';
import SvgYandex from '@/features/auth/ui/sighUpForm/YandexSvg';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useLoginMutation } from '@/features/auth/api/authApi';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { setCredentials } from '@/features/auth/model/authSlice';

const loginSchema = z.object({
  email: z
    .email({
      message: 'The email must match the format example@example.com',
    })
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Minimum number of characters 6')
    .max(20, 'Maximum number of characters 20'),
});

type LoginFormData = z.infer<typeof loginSchema>;

type RTKQueryError = {
  status?: number;
  data?: {
    errorsMessages?: Array<{ message: string; field?: string }>;
    message?: string;
    error?: string;
  };
};

export const LoginForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [serverError, setServerError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError('');

      const response = await login(data).unwrap();

      // Сохраняем токен через Redux action (автоматически сохраняет и в localStorage)
      dispatch(setCredentials({ accessToken: response.accessToken }));

      router.push('/');
      router.refresh();
    } catch (error: unknown) {
      // Отображение ошибки
      let errorMessage = 'Login failed. Please try again.';

      // Обработка ошибок в соответствии с ТЗ
      const rtkError = error as RTKQueryError;

      if (rtkError?.status === 403) {
        errorMessage = 'The email must match the format example@example.com';
      } else if (rtkError?.status === 400) {
        errorMessage = 'Validation error. Please check your input.';
      } else if (rtkError?.status === 429) {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (rtkError?.data?.errorsMessages?.[0]?.message) {
        errorMessage = rtkError.data.errorsMessages[0].message;
      } else if (typeof rtkError?.data?.message === 'string') {
        errorMessage = rtkError.data.message;
      }

      setServerError(errorMessage);
    }
  };

  const handleYandexLogin = () => {
    // код для YandexLogin
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s['login-form']}>
      {/* Форма содержит Email, Password, кнопку [Sign In] */}
      <h1 className={s.title}>Sign In</h1>

      {/* Кнопка Yandex OAuth */}
      <Button
        variant="link"
        size={'lg'}
        fullWidth
        onClick={handleYandexLogin}
        disabled={isLoading}
        style={{ marginBottom: '24px' }}
      >
        <SvgYandex />
      </Button>

      <div className={s['form-wrapper']}>
        {/* Поле Email */}
        <TextField
          label={'Email'}
          variant={'default'}
          placeholder={'Epam@epam.com'}
          fullWidth={true}
          error={errors.email?.message}
          disabled={isLoading}
          {...register('email')}
        />

        {/* Поле Password */}
        <TextField
          label={'Password'}
          variant={'password'}
          placeholder={'**********'}
          fullWidth={true}
          error={errors.password?.message}
          disabled={isLoading}
          {...register('password')}
        />
      </div>

      {/* Отображение серверных ошибок */}
      {serverError && <div className={s['server-error']}>{serverError}</div>}

      <div className={s['auth-actions-block']}>
        {/* Ссылки Forgot Password и Sign Up */}
        <div className={s['forgot-password-wrapper']}>
          <Link
            href="/auth/forgot-password"
            className={s['forgot-password-wrapper-class']}
            onClick={(e) => isLoading && e.preventDefault()}
          >
            <span className={s['forgot-password-text']}>Forgot Password</span>
          </Link>
        </div>

        {/* Кнопка [Sign In] */}
        <div className={s['submit-wrapper']}>
          <Button
            variant={'primary'}
            size={'lg'}
            fullWidth={true}
            type="submit"
            disabled={isLoading}
          >
            <span className={s['title-button']}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </span>
          </Button>
        </div>

        <div className={s['sign-in-wrapper']}>
          <p className={s['sign-in-text']}>Don&apos;t have an account?</p>
          <Link
            href="/auth/sign-up"
            className={s['sign-up-link-focus']}
            onClick={(e) => isLoading && e.preventDefault()}
          >
            <span className={s['sign-up-link-text']}>Sign Up</span>
          </Link>
        </div>
      </div>
    </form>
  );
};
