'use client';

import s from './Header.module.scss';
import { Button, Container } from '@/shared/ui';
import { HeaderSelect } from '@/widgets/header/ui/';
import Link from 'next/link';
import { Typography } from '@/shared/ui/';

export const Header = () => {
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
            <div className={s.buttonWrapper}>
              <Button variant={'link'} asChild>
                <Link href={'/auth/sign-in'}>Log in</Link>
              </Button>
              <Button variant={'primary'} asChild>
                <Link href={'/auth/sign-up'}>Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};
