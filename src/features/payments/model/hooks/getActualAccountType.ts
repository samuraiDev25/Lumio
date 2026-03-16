import { AccountType } from '@/features/payments/model/types/paymentsTypes';

type SubscriptionLike = {
  accountType?: string | null;
  endDate?: string | null;
};

export const getActualAccountType = (
  subscription: SubscriptionLike | null | undefined,
): AccountType => {
  if (!subscription?.endDate) {
    return 'personal';
  }

  const endTime = new Date(subscription.endDate).getTime();

  if (Number.isNaN(endTime)) {
    return 'personal';
  }

  const now = Date.now();

  return endTime > now ? 'business' : 'personal';
};
