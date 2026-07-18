import { create } from 'zustand';
import type { Subscription, SubscriptionPlanInfo } from '@/types';

interface SubscriptionStore {
  subscription: Subscription;
  plans: SubscriptionPlanInfo[];
  setSubscription: (subscription: Subscription) => void;
  setPlans: (plans: SubscriptionPlanInfo[]) => void;
  reset: () => void;
}

const defaultSubscription: Subscription = {
  plan: 'free',
  status: 'active',
  features: ['Basic AI chat', '3 document uploads', 'Limited quizzes'],
};

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  subscription: defaultSubscription,
  plans: [],
  setSubscription: (subscription) => set({ subscription }),
  setPlans: (plans) => set({ plans }),
  reset: () => set({ subscription: defaultSubscription, plans: [] }),
}));
