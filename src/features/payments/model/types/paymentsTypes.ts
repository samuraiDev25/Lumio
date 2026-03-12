export type PaymentProvider = 'Stripe' | 'PayPal';
export type CreateSubscriptionPayload = {
  profileId: string;
  currency: string;
  subscriptionType: string;
  paymentProvider: PaymentProvider;
};
export type MySubscriptionResponse = {
  id: string;
  accountType: string;
  durationType: string;
  endDate: string;
  nextPaymentDate: string;
  autoRenewal: boolean;
};
