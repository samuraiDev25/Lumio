'use client';

import { useEffect, useState } from 'react';
import s from './ProfileAccount.module.scss';
import { PaypalSvgrepoCom4, StripeSvgrepoCom4 } from '@/shared/ui/icons';
import {
  useCreateSubscriptionPaymentMutation,
  useGetMyPaymentsQuery,
  useUpdateAutoRenewalMutation,
} from '@/features/payments/api/paymentsApi';
import { Radio } from '@/shared/ui';
import { useGetProfileQuery } from '@/pages_fsd/profile/api/profileApi';
import { useMeQuery } from '@/features/auth/api/authApi';
import { handleNetworkError } from '@/shared/lib';
import { SignUpType } from '@/features/auth/model/validation';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/shared/hooks';
import { useSearchParams } from 'next/navigation';
import { StripeAutoRenewalModal } from '@/widgets/ProfileAccount/ui/StripeAutoRenewalModal/StripeAutoRenewalModal';
import { CurrentSubscription } from '@/widgets/ProfileAccount/ui/CurrentSubscription/CurrentSubscription';
import { getActualAccountType } from '@/features/payments/model/hooks/getActualAccountType';
import { AccountType } from '@/features/payments/model/types/paymentsTypes';

type SubscriptionPlan = 'weekly10' | 'biweekly50' | 'monthly100';
const accountOptions: {
  value: AccountType;
  label: string;
  disabled?: boolean;
}[] = [
  { value: 'personal', label: 'Personal' },
  { value: 'business', label: 'Business' },
];

const subscriptionOptions: { value: SubscriptionPlan; label: string }[] = [
  { value: 'weekly10', label: '$10 per 1 Week' },
  { value: 'biweekly50', label: '$50 per 2 Weeks' },
  { value: 'monthly100', label: '$100 per month' },
];

const subscriptionMap = {
  weekly10: '1 week',
  biweekly50: '2 weeks',
  monthly100: '1 month',
} as const;

export const ProfileAccount = () => {
  const [accountType, setAccountType] = useState<AccountType>('personal');

  const [plan, setPlan] = useState<SubscriptionPlan>('weekly10');
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [stripeModalKey, setStripeModalKey] = useState(0);

  const [createPayment, { isLoading }] = useCreateSubscriptionPaymentMutation();
  const { data: subscription, refetch: refetchSubscription } =
    useGetMyPaymentsQuery();
  const [updateAutoRenewal, { isLoading: isAutoRenewalUpdating }] =
    useUpdateAutoRenewalMutation();
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
  const searchParams = useSearchParams();

  const isPaymentDisabled = !profile?.id || isLoading;
  const isBusinessAccount = accountType === 'business';

  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      toast.success('Payment was successful!');
      refetchSubscription();
    }
  }, [searchParams, refetchSubscription]);

  const handleToggleAutoRenewal = async (checked: boolean) => {
    if (!profile?.id) return;

    try {
      await updateAutoRenewal({
        profileId: String(profile.id),
        autoRenewal: checked,
      }).unwrap();

      toast.success('Auto-renewal updated');
      refetchSubscription();
    } catch (error) {
      handleNetworkError({
        error,
        dispatch,
        handle400Error: () => {
          toast.error('Invalid auto-renewal request');
        },
        handle401Error: () => {
          toast.error('You are not authorized');
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

  const handlePayment = async (provider: 'Stripe' | 'PayPal') => {
    if (!profile?.id) {
      return;
    }

    try {
      const res = await createPayment({
        profileId: String(profile.id),
        currency: 'USD',
        subscriptionType: subscriptionMap[plan],
        paymentProvider: provider,
      }).unwrap();

      window.location.href = res.url;
    } catch (error) {
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
  return (
    <div className={s.profileAccount}>
      {/*Расскоментировать когда протестируют все*/}

      {/*{subscription && (*/}
      {/*  <CurrentSubscription*/}
      {/*    endDate={subscription?.endDate}*/}
      {/*    nextPaymentDate={subscription?.nextPaymentDate}*/}
      {/*    autoRenewal={subscription?.autoRenewal}*/}
      {/*    isUpdating={isAutoRenewalUpdating}*/}
      {/*    onToggleAutoRenewal={handleToggleAutoRenewal}*/}
      {/*  />*/}
      {/*)}*/}

      {/*Для наглядного пособия*/}
      {1 && (
        <CurrentSubscription
          endDate={subscription?.endDate}
          nextPaymentDate={subscription?.nextPaymentDate}
          autoRenewal={subscription?.autoRenewal}
          isUpdating={isAutoRenewalUpdating}
          onToggleAutoRenewal={handleToggleAutoRenewal}
        />
      )}
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
                isPaymentDisabled ? undefined : () => handlePayment('PayPal')
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
    </div>
  );
};
