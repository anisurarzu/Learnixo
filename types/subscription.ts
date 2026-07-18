export type SubscriptionPlan = 'free' | 'pro' | 'premium';
export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'trialing';

export interface Subscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  renewsAt?: string;
  trialEndsAt?: string;
  features: string[];
}

export interface SubscriptionPlanInfo {
  id: SubscriptionPlan;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  highlighted?: boolean;
}
