import { useEffect, useRef } from 'react';
import {
  PAYMENT_RETURN_URL_KEY,
  PAYMENT_STATUS_HANDLED_KEY,
} from '@/widgets/ProfileAccount/model/constants';

type UsePaymentStatusHandlerParams = {
  onSuccessAction: () => void;
  onErrorAction: () => void;
};

export const usePaymentStatusHandler = ({
  onSuccessAction,
  onErrorAction,
}: UsePaymentStatusHandlerParams) => {
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    const paymentStatus = url.searchParams.get('payment');

    if (!paymentStatus) {
      sessionStorage.removeItem(PAYMENT_STATUS_HANDLED_KEY);
      return;
    }

    const handledStatus = sessionStorage.getItem(PAYMENT_STATUS_HANDLED_KEY);

    if (handledStatus === paymentStatus) {
      handledRef.current = true;
      return;
    }

    handledRef.current = true;
    sessionStorage.setItem(PAYMENT_STATUS_HANDLED_KEY, paymentStatus);

    url.searchParams.delete('payment');

    const nextUrl = url.searchParams.toString()
      ? `${url.pathname}?${url.searchParams.toString()}`
      : url.pathname;

    window.history.replaceState({}, '', nextUrl);
    sessionStorage.removeItem(PAYMENT_RETURN_URL_KEY);

    if (paymentStatus === 'success') {
      onSuccessAction();
      return;
    }

    if (paymentStatus === 'error') {
      onErrorAction();
    }
  }, [onErrorAction, onSuccessAction]);
};
