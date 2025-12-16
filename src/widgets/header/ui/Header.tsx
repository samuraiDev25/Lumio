'use client';

import s from './Header.module.scss';
import { Button, Container } from '@/shared/ui';
import { HeaderSelect } from '@/widgets/header/ui/headerSelect/HeaderSelect';
import Link from 'next/link';
import { Typography } from '@/shared/ui/typography/Typography';

export const Header = () => {
  return (
    <header className={s.header}>
      <Container>
        <div className={s.headerWrapper}>
          <Link href={'/'}>
            <Typography variant={'large'} as={'span'}>
              Instagram
            </Typography>
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
