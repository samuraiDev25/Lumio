'use client';

import s from './Header.module.scss';
import { Button, Container } from '@/shared/ui';
import { HeaderSelect } from '@/widgets/header/index';
import Link from 'next/link';
import { Typography } from '@/shared/ui';
import { useMeQuery } from '@/features/auth/api/authApi';
import { AUTH_ROUTES } from '@/shared/lib/routes';

export const Header = () => {
  const { data } = useMeQuery();

  return (
    <header className={s.header}>
      <Container>
        <div className={s.headerWrapper}>
          <Link href={'/public'}>
            <Typography variant={'large'} as={'span'}>
              Inctagram
            </Typography>
          </Link>
          <div className={s.selectBox}>
            <HeaderSelect />
            <div className={s.buttonWrapper}>
              {!data && (
                <>
                  <Button variant={'link'} asChild>
                    <Link href={AUTH_ROUTES.SIGN_IN}>Log in</Link>
                  </Button>
                  <Button variant={'primary'} asChild>
                    <Link href={AUTH_ROUTES.SIGN_UP}>Sign up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};
