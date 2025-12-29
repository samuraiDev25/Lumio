'use client';

import { Button } from '@/shared/ui';
import Image from 'next/image';
import congratulation from '../../../../../public/congratulation.png';
import emailExpired from '../../../../../public/linkExpired.png';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import s from './ConfirmEmail.module.scss';
import { useConfirmEmailMutation } from '@/features/auth/api/authApi';
import { toast } from 'react-toastify';
import { RegistrationConfirmationErrorResponse } from '@/features/auth/api/authApi.types';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Loading } from '@/shared/ui/loading/Loading';

export function ConfirmEmail() {
  //const [email, setEmail] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get('code');
  const [confirmEmail, { isError, isLoading, isSuccess }] =
    useConfirmEmailMutation();

  useEffect(() => {
    if (!code) return;
    confirmEmail({ confirmCode: code })
      .unwrap()
      .catch((err) => {
        const baseError = err as FetchBaseQueryError;
        const data = baseError.data as RegistrationConfirmationErrorResponse;
        if (baseError.status === 400) {
          const message = data?.errorsMessages?.[0]?.message;
          toast.error(message);
          console.error('Error 400', message);
        } else if (baseError.status === 500) {
          toast.error('Internal server error.');
          console.error('Error 500 Internal server error.');
        } else {
          toast.error('Unexpected error occurred.');
        }
      });
  }, [code, confirmEmail]);

  const handleSignIn = () => {
    router.push('/auth/sign-in');
  };
  const handleResendLink = () => {
    router.push('/auth/sign-up');
  };
  return (
    <div className={s.container}>
      <div className={s.content}>
        {isLoading && <Loading />}
        {isSuccess && (
          <>
            <h1 className={s.title}>Congratulations!</h1>
            <div className={s.subtitle}>
              <p>Your email has been confirmed</p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={handleSignIn}
              className={s.button}
            >
              Sign In
            </Button>
            <div className={s.illustration}>
              <Image
                src={congratulation}
                alt="Email confirmed illustration"
                width={500}
                height={400}
                priority
                className={s.illustrationImage}
              />
            </div>
          </>
        )}

        {isError && (
          <>
            <h1 className={s.title}>Email verification link expired</h1>
            <div className={s.subtitle}>
              <p>
                Looks like the verification link has expired. Please register
                again.
              </p>
            </div>
            {/*<div className={s.formWrapper}>*/}
            {/*  <TextField*/}
            {/*    label="Email"*/}
            {/*    variant="default"*/}
            {/*    placeholder="Epam@epam.com"*/}
            {/*    value={email}*/}
            {/*    onChange={(e) => setEmail(e.target.value)}*/}
            {/*  />*/}
            {/*</div>*/}

            <Button
              variant="primary"
              size="lg"
              onClick={handleResendLink}
              className={s.smallText}
            >
              Return to registration
            </Button>

            <div className={s.illustration}>
              <Image
                src={emailExpired}
                alt="Email verification expired"
                width={400}
                height={350}
                priority
                className={s.illustrationImage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
