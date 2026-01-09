'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Checkbox, TextField } from '@/shared/ui';
import Link from 'next/link';
import SvgYandex from '@/shared/ui/icons/YandexSvg';
import { useState } from 'react';
import { useRegistrationMutation } from '@/features/auth/api/authApi';
import { signUpSchema, SignUpType } from '@/features/auth/model/validation';
import { toast } from 'react-toastify';
import s from './SignUpForm.module.scss';
import { ServerErrorRegistration } from '@/features/auth/api/authApi.types';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { EmailSentModal } from '@/features/auth/ui/sighUpForm/emailSentModal/EmailSentModal';
import { EyeOffOutline, EyeOutline } from '@/shared/ui/icons';
import { useRouter } from 'next/navigation';

export const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors, isValid, isDirty },
  } = useForm<SignUpType>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      isAgree: true,
    },
  });
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const [registration] = useRegistrationMutation();
  const onSubmit = async (data: SignUpType) => {
    try {
      await registration({
        username: data.name,
        email: data.email,
        password: data.password,
      }).unwrap();
      setSubmittedEmail(data.email);
      setIsModalOpen(true);
      reset();
      console.error('User successfully registered');
    } catch (err) {
      const error = err as FetchBaseQueryError;

      if (error.status === 400) {
        const data = error.data as ServerErrorRegistration;
        data.errorsMessages.forEach((err) => {
          if (err.field) {
            console.error('Error 400:', err.message);
            setError(err.field as keyof SignUpType, {
              type: 'server',
              message: err.message,
            });
          }
        });
      } else if (error.status === 429) {
        const data = error.data as ServerErrorRegistration;
        const msg = data.errorsMessages?.[0]?.message;
        console.error('Error 429:', msg);
        toast.error(msg);
      }
      if (error.status === 500) {
        toast.error('Internal server error.');
        return;
      }
    }
  };

  const handleYandexSignUp = () => router.push('/auth/oauth-success');
  const handleCloseModal = () => setIsModalOpen(false);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={s.signUpForm}>
        <h1 className={s.title}>Sign Up</h1>
        <Button
          variant="link"
          size={'lg'}
          fullWidth
          onClick={handleYandexSignUp}
        >
          <SvgYandex />
        </Button>
        <div className={s.formWrapper}>
          <TextField
            type={'textarea'}
            label={'Username'}
            placeholder={'Epam11'}
            disabled={false}
            errorMessage={errors.name?.message}
            {...register('name')}
          />
          <TextField
            type={'email'}
            label={'Email'}
            placeholder={'Epam@epam.com'}
            autoComplete={'email'}
            errorMessage={errors.email?.message}
            {...register('email')}
          />
          <TextField
            type={showPassword ? 'text' : 'password'}
            label={'Password'}
            placeholder={'*********'}
            iconEnd={
              <span className={s.customIconEnd}>
                {showPassword ? <EyeOutline /> : <EyeOffOutline />}
              </span>
            }
            onEndIconClick={() => setShowPassword((prev) => !prev)}
            errorMessage={errors.password?.message}
            {...register('password')}
          />
          <TextField
            type={showConfirmPassword ? 'text' : 'password'}
            label={'Password confirmation'}
            placeholder={'*********'}
            iconEnd={
              <span className={s.customIconEnd}>
                {showConfirmPassword ? <EyeOutline /> : <EyeOffOutline />}
              </span>
            }
            onEndIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
            errorMessage={errors.passwordConfirmation?.message}
            {...register('passwordConfirmation')}
          />
        </div>
        <div className={s.checkBoxWrapper}>
          <Controller
            name="isAgree"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={field.onChange}
                className={s.checkBox}
                errorMessage={errors.isAgree?.message}
                label={
                  <span className={s.label}>
                    I agree to the{' '}
                    <Link className={s.link} href="/auth/terms-of-service">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link className={s.link} href="/auth/privacy-policy">
                      Privacy Policy
                    </Link>
                  </span>
                }
              />
            )}
          />
        </div>
        <div className={s.submitWrapper}>
          <Button
            variant={'primary'}
            size={'lg'}
            fullWidth={true}
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || !isDirty}
          >
            <h3 className={s.titleButton}>Sign up</h3>
          </Button>
        </div>
        <div className={s.signInWrapper}>
          <p className={s.signInText}>Do you have an account?</p>
          <Link href="/auth/sign-in" className={s.signInLink}>
            <h3>Sign In</h3>
          </Link>
        </div>
      </form>
      {/* Modal after registration*/}
      <EmailSentModal
        open={isModalOpen}
        email={submittedEmail}
        onCloseAction={handleCloseModal}
      />
    </>
  );
};
