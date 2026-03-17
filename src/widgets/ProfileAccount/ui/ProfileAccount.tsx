'use client';

import { useEffect, useState } from 'react';
import s from './ProfileAccount.module.scss';
import { PaypalSvgrepoCom4, StripeSvgrepoCom4 } from '@/shared/ui/icons';
import {
  useCreateSubscriptionPaymentMutation,
  useGetMySubscriptionQuery,
} from '@/features/payments/api/paymentsApi';
import { Radio } from '@/shared/ui';
import { useGetProfileQuery } from '@/pages_fsd/profile/api/profileApi';
import { useMeQuery } from '@/features/auth/api/authApi';
import { handleNetworkError } from '@/shared/lib';
import { SignUpType } from '@/features/auth/model/validation';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/shared/hooks';
import { StripeAutoRenewalModal } from '@/widgets/ProfileAccount/ui/StripeAutoRenewalModal/StripeAutoRenewalModal';
import { CurrentSubscription } from '@/widgets/ProfileAccount/ui/CurrentSubscription/CurrentSubscription';
import { PaymentSuccessDialog } from '@/widgets/ProfileAccount/ui/PaymentSuccessDialog/PaymentSuccessDialog';
import { PaymentErrorDialog } from '@/widgets/ProfileAccount/ui/PaymentErrorDialog/PaymentErrorDialog';
import { getActualAccountType } from '@/features/payments/model/hooks/getActualAccountType';
import { AccountType } from '@/features/payments/model/types/paymentsTypes';
import {
  accountOptions,
  PAYMENT_RETURN_URL_KEY,
  SubscriptionPlan,
  subscriptionMap,
  subscriptionOptions,
} from '@/widgets/ProfileAccount/model/constants';
import { usePaymentStatusHandler } from '@/widgets/ProfileAccount/model/hooks/usePaymentStatusHandler';

export const ProfileAccount = () => {
  const [accountType, setAccountType] = useState<AccountType>('personal');
  const [plan, setPlan] = useState<SubscriptionPlan>('weekly10');
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [stripeModalKey, setStripeModalKey] = useState(0);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailedModalOpen, setIsFailedModalOpen] = useState(false);

  const [createPayment, { isLoading }] = useCreateSubscriptionPaymentMutation();
  const { data: subscription, refetch: refetchSubscription } =
    useGetMySubscriptionQuery();

  const { data: me, isLoading: isMeLoading } = useMeQuery();
  const userId = me?.userId ? Number(me.userId) : null;

  const { data: profile } = useGetProfileQuery(userId!, {
    skip: !userId || isMeLoading,
    refetchOnMountOrArgChange: false,
  });

  useEffect(() => {
    setAccountType(getActualAccountType(subscription));
  }, [subscription]);

  const dispatch = useAppDispatch();

  const isPaymentDisabled = !profile?.id || isLoading;
  const isBusinessAccount = accountType === 'business';

  usePaymentStatusHandler({
    onSuccess: () => setIsSuccessModalOpen(true),
    onError: () => setIsFailedModalOpen(true),
    refetchSubscription,
  });

  const handleAutoRenewalChange = async (
    autoRenewal: boolean,
    newAccountType?: AccountType,
  ) => {
    if (newAccountType && newAccountType !== accountType) {
      setAccountType(newAccountType);
    }
    await refetchSubscription();
  };

  const handlePayment = async (provider: 'Stripe' | 'PayPal') => {
    if (!profile?.id) {
      return;
    }

    try {
      sessionStorage.setItem(PAYMENT_RETURN_URL_KEY, window.location.href);

      const res = await createPayment({
        profileId: String(profile.id),
        currency: 'USD',
        subscriptionType: subscriptionMap[plan],
        paymentProvider: provider,
      }).unwrap();

      window.location.href = res.url;
    } catch (error) {
      sessionStorage.removeItem(PAYMENT_RETURN_URL_KEY);

      handleNetworkError({
        error,
        dispatch,
        handle400Error: (error) => {
          error.errorsMessages?.forEach((m) => {
            if (m.field) {
              console.error(m.field as keyof SignUpType, {
                type: 'server',
                message: m.message,
              });
            }
          });
        },
        handle401Error: (error) => {
          error.errorsMessages?.forEach((m) => {
            if (m.field) {
              console.error(m.field as keyof SignUpType, {
                type: 'server',
                message: m.message,
              });
            }
          });
        },
        handle429Error: () => {
          toast.error('Too many requests.');
        },
        handle500Error: () => {
          toast.error('Internal server error');
        },
        handleUnknownError: () => {
          toast.error('Unexpected error');
        },
      });
    }
  };
  const handleOpenStripeModal = () => {
    if (isPaymentDisabled) return;

    setStripeModalKey((prev) => prev + 1);
    setIsStripeModalOpen(true);
  };

  const handleCloseStripeModal = () => {
    setIsStripeModalOpen(false);
  };

  const handleConfirmStripePayment = async () => {
    setIsStripeModalOpen(false);
    await handlePayment('Stripe');
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  const handleCloseFailedModal = () => {
    setIsFailedModalOpen(false);
  };

  return (
    <div className={s.profileAccount}>
      {/*Расскоментировать когда протестируют все*/}

       {subscription && (
        <CurrentSubscription
          endDate={subscription?.endDate}
          nextPaymentDate={subscription?.nextPaymentDate}
          autoRenewal={subscription?.autoRenewal}
          accountType={accountType}
          onAutoRenewalChange={handleAutoRenewalChange}
        />
      )}

      {/*Для наглядного пособия*/}
      {/* {1 && (
        <CurrentSubscription
          endDate={subscription?.endDate}
          nextPaymentDate={subscription?.nextPaymentDate}
          autoRenewal={subscription?.autoRenewal}
          accountType={accountType}
          onAutoRenewalChange={handleAutoRenewalChange}
        />
      )} */}
      <div className={s.section}>
        <p className={s.sectionTitle}>Account type:</p>

        <div className={s.card}>
          <Radio
            className={s.radioGroup}
            name="account-type"
            value={accountType}
            options={accountOptions}
            onChange={(value) => setAccountType(value as AccountType)}
          />
        </div>
      </div>
      {isBusinessAccount && (
        <>
          <div className={s.section}>
            <p className={s.sectionTitle}>Your subscription costs:</p>

            <div className={s.card}>
              <Radio
                className={s.radioGroup}
                name="subscription-plan"
                value={plan}
                options={subscriptionOptions}
                onChange={(value) => setPlan(value as SubscriptionPlan)}
              />
            </div>
          </div>

          <div className={s.payment}>
            <PaypalSvgrepoCom4
              className={`${s.paymentIcon} ${isPaymentDisabled ? s.paymentIconDisabled : ''}`}
              backgroundColor="#171717"
              width={96}
              height={64}
              onClick={
                isPaymentDisabled ? undefined : () => alert('Not available')
              }
            />
            <span className={s.or}>Or</span>

            <StripeSvgrepoCom4
              className={`${s.paymentIcon} ${isPaymentDisabled ? s.paymentIconDisabled : ''}`}
              backgroundColor="#171717"
              width={96}
              height={64}
              onClick={isPaymentDisabled ? undefined : handleOpenStripeModal}
            />
            <StripeAutoRenewalModal
              key={stripeModalKey}
              open={isStripeModalOpen}
              onCloseAction={handleCloseStripeModal}
              onConfirmAction={handleConfirmStripePayment}
              isLoading={isLoading}
            />
          </div>
        </>
      )}
      <PaymentSuccessDialog
        open={isSuccessModalOpen}
        onCloseAction={handleCloseSuccessModal}
      />
      <PaymentErrorDialog
        open={isFailedModalOpen}
        onCloseAction={handleCloseFailedModal}
      />
    </div>
  );
};
