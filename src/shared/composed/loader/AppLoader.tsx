'use client';

import NextTopLoader, {
  NextTopLoaderProps,
  useTopLoader,
} from 'nextjs-toploader';
import { useEffect } from 'react';
import { useAppSelector } from '@/shared/hooks';
import { selectIsLoading } from '@/shared/api/baseSlice';

type Props = NextTopLoaderProps;

export const AppLoader = (props: Props) => {
  const isLoading = useAppSelector(selectIsLoading);
  const { start, isStarted, done } = useTopLoader();

  useEffect(() => {
    if (isLoading) {
      if (!isStarted()) {
        start();
      }
    } else {
      done();
    }

    return () => {
      if (isStarted()) {
        done(true);
      }
    };
  }, [isLoading, isStarted, start, done]);

  return (
    <NextTopLoader
      {...props}
      showSpinner={false}
      initialPosition={0.2}
      height={4}
      speed={400}
      crawlSpeed={100}
    />
  );
};
