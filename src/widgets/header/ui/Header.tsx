'use client';

import s from './Header.module.scss';
import { Button, Container } from '@/shared/ui';
import { HeaderSelect } from '@/widgets/header/ui/';
import { LogOutButton } from '@/features/logout/ui';
import Link from 'next/link';
import { Typography } from '@/shared/ui/';

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
              <LogOutButton
                variant={'outline'}
                onLogout={() => {
                  // Вся основная логика выхода (API вызов, очистка токенов, редирект) 
                  // уже реализована внутри LogOutButton компонента.
                  // Здесь можно добавить дополнительную логику при необходимости:
                  // - Обновление состояния Header (скрытие/показ элементов для авторизованных пользователей)
                  // - Логирование события выхода
                  // - Обновление глобального состояния (Redux/Context) если будет добавлено
                }}
              />
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};
