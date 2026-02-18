import Link from 'next/link';
import s from './not-found.module.scss';
import MainLayout from '@/app/MainLayout';
import { APP_ROUTES } from '@/shared/lib/routes';

export default function NotFound() {
  return (
    <MainLayout>
      <div className={s.container}>
        <h1 className={s.code}>404</h1>

        <h2 className={s.title}>Page not found</h2>

        <p className={s.description}>
          The page you are looking for does not exist or was moved.
        </p>

        <Link href={APP_ROUTES.ROOT}>Back to Home</Link>
      </div>
    </MainLayout>
  );
}
