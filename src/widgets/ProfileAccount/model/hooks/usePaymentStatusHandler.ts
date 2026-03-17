'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  PAYMENT_RETURN_URL_KEY,
  PaymentResultStatus,
} from '@/widgets/ProfileAccount/model/constants';

type UsePaymentStatusHandlerParams = {
  onSuccess: () => void;
  onError: () => void;
  refetchSubscription: () => Promise<unknown>;
};

export const usePaymentStatusHandler = ({
  onSuccess,
  onError,
  refetchSubscription,
}: UsePaymentStatusHandlerParams) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const normalizedStatus = paymentStatus?.toLowerCase();

    let paymentResultStatus: PaymentResultStatus = null;

    if (normalizedStatus === 'success') {
      paymentResultStatus = 'success';
    } else if (normalizedStatus === 'error') {
      paymentResultStatus = 'error';
    }

    if (!paymentResultStatus) {
      return;
    }

    const storedReturnUrl = sessionStorage.getItem(PAYMENT_RETURN_URL_KEY);

    if (storedReturnUrl) {
      const targetUrl = new URL(storedReturnUrl);

      targetUrl.searchParams.set('payment', paymentResultStatus);

      if (targetUrl.toString() !== window.location.href) {
        router.replace(
          `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`,
        );
        return;
      }
    }

    if (paymentResultStatus === 'success') {
      onSuccess();
      void refetchSubscription();
    } else {
      onError();
    }

    sessionStorage.removeItem(PAYMENT_RETURN_URL_KEY);

    const cleanedUrl = new URL(window.location.href);

    cleanedUrl.searchParams.delete('payment');
    router.replace(
      `${cleanedUrl.pathname}${cleanedUrl.search}${cleanedUrl.hash}`,
    );
  }, [onError, onSuccess, refetchSubscription, router, searchParams]);
};
