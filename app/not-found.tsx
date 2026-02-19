import Link from 'next/link';
import s from './not-found.module.scss';
import MainLayout from '@/app/MainLayout';
import { APP_ROUTES } from '@/shared/lib/routes';
import { Button } from '@/shared/ui';
import Image from 'next/image';

export default function NotFound() {
  return (
    <MainLayout>
      <div className={s.container}>
        <Image
          src="/404/notFound.png"
          alt="404 Not Found"
          width={1200}
          height={600}
          priority
        />

        <p className={s.description}>
          The page you are looking for does not exist or was moved.
        </p>

        <Link href={APP_ROUTES.ROOT}>
          <Button variant={'outline'}>Back to Home</Button>
        </Link>
      </div>
    </MainLayout>
  );
}
