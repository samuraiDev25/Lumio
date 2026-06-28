'use client';

import s from './Header.module.scss';
import { Button, Container } from '@/shared/ui';
import { HeaderSelect } from '@/widgets/header/ui/';
import Link from 'next/link';
import { Typography } from '@/shared/ui/';
import { useMeQuery } from '@/features/auth/api/authApi';
import { AUTH_ROUTES } from '@/shared/lib/routes';
import { Notifications } from '@/features/notifications/ui/Notifications';

export const Header = () => {
  const { data } = useMeQuery();

  return (
    <header className={s.header}>
      <Container>
        <div className={s.headerWrapper}>
          <Link href={'/'}>
            <Typography variant={'large'} as={'span'} className={s.logo}>
              L U M I O{/*<span*/}
              {/*  onClick={() => {*/}
              {/*    fetch('https://lumio.su/api/v1/testing/all-data', {*/}
              {/*      method: 'DELETE',*/}
              {/*    });*/}
              {/*  }}*/}
              {/*>*/}
              {/*  .*/}
              {/*</span>*/}
            </Typography>
          </Link>

          <div className={s.selectBox}>
            {data?.email && (
              <div className={s.bell}>
                <Notifications />
              </div>
            )}
            <HeaderSelect />
            <div className={s.buttonWrapper}>
              {!data?.email && (
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
