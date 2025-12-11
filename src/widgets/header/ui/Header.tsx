'use client';

import s from './Header.module.scss';
import { Button, Container } from '@/shared/ui';
import { HeaderSelect } from '@/widgets/header/ui/headerSelect/HeaderSelect';
import Link from 'next/link';

export const Header = () => {
  return (
    <header className={s.header}>
      <Container>
        <div className={s.headerWrapper}>
          <Link href={'/'} className={s.logo}>
            <h1>Inctagram</h1>
          </Link>
          <div className={s.selectBox}>
            <HeaderSelect />
            <div className={s.buttonWrapper}>
              <Button variant={'link'} asChild>
                <Link href={'/log-in'}>Log in</Link>
              </Button>
              <Button variant={'primary'} asChild>
                <Link href={'/sign-in'}>Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};
