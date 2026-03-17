import { AccountType } from '@/features/payments/model/types/paymentsTypes';

export type SubscriptionPlan = 'weekly10' | 'biweekly50' | 'monthly100';
export type PaymentResultStatus = 'success' | 'error' | null;

export const PAYMENT_RETURN_URL_KEY = 'paymentReturnUrl';

export const accountOptions: {
  value: AccountType;
  label: string;
  disabled?: boolean;
}[] = [
  { value: 'personal', label: 'Personal' },
  { value: 'business', label: 'Business' },
];

export const subscriptionOptions: {
  value: SubscriptionPlan;
  label: string;
}[] = [
  { value: 'weekly10', label: '$10 per 1 Week' },
  { value: 'biweekly50', label: '$50 per 2 Weeks' },
  { value: 'monthly100', label: '$100 per month' },
];

export const subscriptionMap: Record<SubscriptionPlan, string> = {
  weekly10: '1 week',
  biweekly50: '2 weeks',
  monthly100: '1 month',
};
