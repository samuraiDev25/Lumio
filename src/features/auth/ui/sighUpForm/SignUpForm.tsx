'use client';

import s from './SignUpForm.module.scss';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Checkbox, TextField } from '@/shared/ui';
import Link from 'next/link';
import SvgYandex from './YandexSvg';

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
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      agreeToTerms: true,
    },
  });
  const onSubmit = (data: SignUpFormData) => {
    console.log('Form submitted:', data);
    // логику добавить отправки формы
    reset();
  };
  const handleYandexSignUp = () => {
    console.log('Yandex Sign Up');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s.signUpForm}>
      <h1 className={s.title}>Sign Up</h1>
      <Button variant="link" size={'lg'} fullWidth onClick={handleYandexSignUp}>
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
                  <Link className={s.link} href="/auth/terms-of-service">
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
  );
};
