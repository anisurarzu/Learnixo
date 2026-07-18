import { create } from 'zustand';
import type { UserPreferences, UserProfile } from '@/types';

interface UserStore {
  profile: UserProfile | null;
  preferences: UserPreferences;
  setProfile: (profile: UserProfile | null) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  reset: () => void;
}

const defaultPreferences: UserPreferences = {
  language: 'en',
  notificationsEnabled: true,
  soundEnabled: true,
  hapticsEnabled: true,
};

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  preferences: defaultPreferences,
  setProfile: (profile) => set({ profile }),
  updatePreferences: (prefs) =>
    set((state) => ({ preferences: { ...state.preferences, ...prefs } })),
  reset: () => set({ profile: null, preferences: defaultPreferences }),
}));
