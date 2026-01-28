'use client';

import { Button, TextField } from '@/shared/ui';
import Link from 'next/link';
import { useState } from 'react';
import s from './SignUpForm.module.scss';
import { EmailSentModal } from '@/features/auth/ui/sighUpForm/components/emailSentModal/EmailSentModal';
import { EyeOffOutline, EyeOutline } from '@/shared/ui/icons';
import { AUTH_ROUTES } from '@/shared/lib/routes';
import { YandexAuthButton } from '@/features/auth/ui/sighUpForm/components/yandexauthbutton/Yandexauthbutton';
import { TermsCheckbox } from '@/features/auth/ui/sighUpForm/components/termscheckbox/Termscheckbox';
import { useSignUpForm } from '@/features/auth/ui/sighUpForm/hooks/useSignUpForm';

export const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    formMethods,
    onSubmit,
    submittedEmail,
    isModalOpen,
    handleCloseModal,
  } = useSignUpForm();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty },
  } = formMethods;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={s.signUpForm}>
        <h1 className={s.title}>Sign Up</h1>
        <YandexAuthButton />
        <div className={s.formWrapper}>
          <TextField
            type={'textarea'}
            label={'Username'}
            placeholder={'Epam11'}
            disabled={false}
            errorMessage={errors.username?.message}
            {...register('username')}
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
        <TermsCheckbox control={control} errors={errors} />
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
          <Link href={AUTH_ROUTES.SIGN_IN} className={s.signInLink}>
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
