'use client';

import { Button, TextField } from '@/shared/ui';
import Image from 'next/image';
import congratulation from '../../../../../../public/congratulation.png';
import emailExpired from '../../../../../../public/linkExpired.png';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import s from './ConfirmEmail.module.scss';

export function ConfirmEmail() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [email, setEmail] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get('code');
  console.log(code);
  useEffect(() => {
    if (!code) return;
    const confirmEmail = async () => {
      try {
        const response = await fetch(
          'https://lumio.su/api/v1/auth/registration-confirmation',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ confirmCode: code }),
          },
        );
        console.log('Response status:', response.status);
        // 204 = успех
        if (response.status === 204) {
          setIsSuccess(true);
          console.log('Email successfully confirmed');
        }
        // 400 = невалидный/истекший код
        if (response.status === 400) {
          const errorData = await response.json();
          setIsExpired(true);
          const message = errorData.errorsMessages?.[0]?.message;
          console.error('Error 400:', message);
        }
      } catch (error) {
        console.error('Network error:', error);
        setIsExpired(true);
      }
    };

    confirmEmail();
  }, [code]);

  const handleSignIn = () => {
    router.push('/auth/sign-in');
  };
  const handleResendLink = () => {
    router.push('/auth/sign-up');
  };
  return (
    <div className={s.container}>
      <div className={s.content}>
        {isSuccess ? (
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
        ) : (
          <>
            <h1 className={s.title}>Email verification link expired</h1>
            <div className={s.subtitle}>
              <p>
                Looks like the verification link has expired. Not to worry, we
                can send the link again
              </p>
            </div>
            <div className={s.formWrapper}>
              <TextField
                label="Email"
                variant="default"
                placeholder="Epam@epam.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleResendLink}
              className={s.smallText}
              disabled={!email}
            >
              Resend verification link
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
