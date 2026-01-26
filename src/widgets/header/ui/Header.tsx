'use client';

import s from './Header.module.scss';
import { Button, Container } from '@/shared/ui';
import { HeaderSelect } from '@/widgets/header/ui/';
import Link from 'next/link';
import { Typography } from '@/shared/ui/';
import { useLoginMutation } from '@/features/auth/api/authApi';
import { AUTH_ROUTES } from '@/shared/lib/routes';

export const Header = () => {
  const [login] = useLoginMutation();
  return (
    <header className={s.header}>
      <Container>
        <div className={s.headerWrapper}>
          <Link href={'/'}>
            <Typography variant={'large'} as={'span'}>
              Inctagram
            </Typography>
            <button
              onClick={() => {
                fetch('https://lumio.su/api/v1/testing/all-data', {
                  method: 'DELETE',
                }).then((responce) => {
                  if (responce.status === 204) {
                    console.log('Данные успешно удалены');
                  }
                });
              }}
            >
              Clean BD
            </button>
          </Link>
          <div className={s.selectBox}>
            <HeaderSelect />
            {!login && (
              <div className={s.buttonWrapper}>
                <Button variant={'link'} asChild>
                  <Link href={AUTH_ROUTES.SIGN_IN}>Log in</Link>
                </Button>
                <Button variant={'primary'} asChild>
                  <Link href={AUTH_ROUTES.SIGN_UP}>Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};
