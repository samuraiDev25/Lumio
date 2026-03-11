export type PaymentProvider = 'Stripe' | 'PayPal';
export type CreateSubscriptionPayload = {
  profileId: string;
  currency: string;
  subscriptionType: string;
  paymentProvider: PaymentProvider;
};
