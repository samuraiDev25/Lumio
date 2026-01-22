'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useConfirmEmailMutation } from '@/features/auth/api/authApi';
import { toast } from 'react-toastify';
import { RegistrationConfirmationErrorResponse } from '@/features/auth/api/authApi.types';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Loading } from '@/shared/ui/loading/Loading';
import { ResultConfirmation } from '@/features/auth/ui/confirmEmail/resultConfirmation/ResultConfirmation';
import { AUTH_ROUTES } from '@/shared/lib/routes';

export function ConfirmEmail() {
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

  const handleSignIn = () => router.push(AUTH_ROUTES.SIGN_IN);
  const handleResendLink = () => router.push(AUTH_ROUTES.SIGN_UP);
  if (isLoading) return <Loading />;
  if (isSuccess)
    return (
      <ResultConfirmation
        title="Congratulations!"
        subtitle="Your email has been confirmed"
        buttonText="Sign In"
        onClickAction={handleSignIn}
        imageSrc="/congratulation.png"
        imageAlt="Email confirmed illustration"
      />
    );
  if (isError)
    return (
      <ResultConfirmation
        title="Email verification link expired"
        subtitle="Looks like the verification link has expired. Please register again."
        buttonText="Return to registration"
        onClickAction={handleResendLink}
        imageSrc="/linkExpired.png"
        imageAlt="Email verification expired"
      />
    );
  return null;
}
