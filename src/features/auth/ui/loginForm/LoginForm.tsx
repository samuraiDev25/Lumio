'use client';

import s from './LoginForm.module.scss';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextField } from '@/shared/ui';
import Link from 'next/link';
import SvgYandex from '@/shared/ui/icons/YandexSvg';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authApi, useLoginMutation } from '@/features/auth/api/authApi';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { setCredentials } from '@/features/auth/model/authSlice';
import { EyeOffOutline, EyeOutline } from '@/shared/ui/icons';
import { AUTH_ROUTES } from '@/shared/lib/routes';
import { signInSchema, SignInType } from '@/features/auth/model/validation';
import { handleNetworkError } from '@/shared/lib';
import { toast } from 'react-toastify';

/**
 * LoginForm component for user authentication.
 *
 * Features:
 * - Validation: Implements centralized 'signInSchema' using react-hook-form and zod.
 * - Error Handling: Integrated with a global network error handler to map server-side
 *   validation errors directly to form fields or the form root.
 * - State Management: Handles successful authentication by dispatching credentials
 *   to Redux and managing session persistence.
 * - UI/UX: Provides toggleable password visibility and prevents navigation during
 *   active loading states.
 */
export const LoginForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInType>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInType) => {
    try {
      const response = await login(data).unwrap();
      // Save token via Redux action (automatically persists to localStorage)
      dispatch(setCredentials({ accessToken: response.accessToken }));
      // Fetch current user data to obtain the userId
      // Use dispatch to initiate the 'me' endpoint and wait for the result
      const user = await dispatch(authApi.endpoints.me.initiate()).unwrap();
      const userId = user.userId;

      router.push(`/profile/${userId}`);
      router.refresh();
    } catch (error: unknown) {
      handleNetworkError({
        error,
        dispatch,
        handle400Error: (baseResponseError) => {
          baseResponseError.errorsMessages?.forEach((err) => {
            if (err.field) {
              const fieldName = err.field as 'email' | 'password';
              setError(fieldName, { message: err.message });
            }
          });
        },
        handle403Error: (baseResponseError) => {
          baseResponseError.errorsMessages?.forEach((err) => {
            if (err.field) {
              const fieldName = err.field as 'email' | 'password';
              setError(fieldName, { message: err.message });
            } else {
              setError('root', { message: err.message });
            }
          });
        },
        handle500Error: () => {
          toast.error('Some error occurred');
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s['login-form']}>
      <h1 className={s.title}>Sign In</h1>

      <Button type="button" variant="link" size="lg" fullWidth asChild>
        <a href="/api/v1/auth/yandex">
          <SvgYandex />
        </a>
      </Button>

      <div className={s['form-wrapper']}>
        <TextField
          type="email"
          label="Email"
          placeholder="Epam@epam.com"
          autoComplete="email"
          errorMessage={errors.email?.message}
          disabled={isLoading}
          {...register('email')}
        />

        <TextField
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="**********"
          iconEnd={
            <span className={s['custom-icon-end']}>
              {showPassword ? <EyeOutline /> : <EyeOffOutline />}
            </span>
          }
          onEndIconClick={() => setShowPassword((prev) => !prev)}
          errorMessage={errors.password?.message}
          disabled={isLoading}
          {...register('password')}
        />
      </div>

      {errors.root && (
        <div className={s['server-error']}>{errors.root.message}</div>
      )}

      <div className={s['auth-actions-block']}>
        <div className={s['forgot-password-wrapper']}>
          <Link
            href={AUTH_ROUTES.RECOVERY}
            className={s['forgot-password-wrapper-class']}
            onClick={(e) => isLoading && e.preventDefault()}
          >
            <span className={s['forgot-password-text']}>Forgot Password</span>
          </Link>
        </div>

        <div className={s['submit-wrapper']}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
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
            href={AUTH_ROUTES.SIGN_UP}
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
