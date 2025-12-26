'use client';

import s from './SignUpForm.module.scss';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Checkbox, TextField } from '@/shared/ui';
import Link from 'next/link';
import SvgYandex from './YandexSvg';
import { useState } from 'react';
import { Modal } from '@/shared/ui/modal/Modal';

// Zod
const signUpSchema = z
  .object({
    username: z
      .string()
      .min(6, 'Minimum number of characters 6')
      .max(30, 'Maximum number of characters 30')
      .regex(
        /^[0-9A-Za-z_-]+$/,
        'Only letters, numbers, underscore and hyphen are allowed',
      ),
    email: z.email('The email must match the format example@example.com'),
    password: z
      .string()
      .min(6, 'Minimum number of characters 6')
      .max(20, 'Maximum number of characters 20')
      .regex(
        /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])[0-9A-Za-z!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/,
        'Password must contain a-z, A-Z,  ! " # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _` { | } ~',
      ),
    passwordConfirmation: z.string().min(1, 'The passwords must match'),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the terms',
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });
type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors, isValid, isDirty },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      agreeToTerms: true,
    },
  });
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onSubmit = async (data: SignUpFormData) => {
    console.log('Form submitted:', data);
    try {
      const response = await fetch(
        'https://lumio.su/api/v1/auth/registration',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: data.username,
            email: data.email,
            password: data.password,
          }),
        },
      );
      if (response.status === 204 || response.ok) {
        setSubmittedEmail(data.email);
        setIsModalOpen(true);
        reset();
      } else if (response.status === 400) {
        const errorData = await response.json();
        if (Array.isArray(errorData.errorsMessages)) {
          errorData.errorsMessages.forEach(
            (err: { field: keyof SignUpFormData; message: string }) => {
              setError(err.field, { type: 'server', message: err.message });
            },
          );
        }
      } else {
        console.error('Unexpected error');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const handleYandexSignUp = () => {
    console.log('Yandex Sign Up');
    setTimeout(() => {
      fetch('https://lumio.su/api/v1/testing/all-data', { method: 'DELETE' })
        .then((response) => {
          if (response.status === 204) {
            console.log('Данные успешно удалены');
          } else {
            console.error('Ошибка при удалении:', response.status);
          }
        })
        .catch((error) => {
          console.error('Сетевая ошибка:', error);
        });
    }, 2000);
  };

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
            label={'Username'}
            variant={'default'}
            placeholder={'Epam11'}
            fullWidth={true}
            error={errors.username?.message}
            {...register('username')}
          />
          <TextField
            label={'Email'}
            variant={'default'}
            placeholder={'Epam@epam.com'}
            fullWidth={true}
            error={errors.email?.message}
            {...register('email')}
          />
          <TextField
            label={'Password'}
            variant={'password'}
            placeholder={'*********'}
            fullWidth={true}
            error={errors.password?.message}
            {...register('password')}
          />
          <TextField
            label={'Password confirmation'}
            variant={'password'}
            placeholder={'*********'}
            fullWidth={true}
            error={errors.passwordConfirmation?.message}
            {...register('passwordConfirmation')}
          />
        </div>
        <div className={s.checkBoxWrapper}>
          <Controller
            name="agreeToTerms"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={field.onChange}
                className={s.checkBox}
                errorMessage={errors.agreeToTerms?.message}
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
      {/* Modal */}
      <Modal
        open={isModalOpen}
        showCloseButton={true}
        title={'Email sent'}
        size={'sm'}
        onClose={() => setIsModalOpen(false)}
      >
        <p className={s.modalText}>
          {' '}
          We have sent a link to confirm your email to{' '}
          <strong>{submittedEmail}</strong>
        </p>
        <Button
          className={s.buttonModal}
          variant={'primary'}
          size={'sm'}
          onClick={() => setIsModalOpen(false)}
        >
          OK
        </Button>
      </Modal>
    </>
  );
};
