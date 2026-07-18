import { create } from 'zustand';
import { STORAGE_KEYS } from '@/constants';
import type { AuthTokens, AuthUser } from '@/types';
import { secureStorage } from '@/utils/secure-storage';

interface AuthStore {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  setAuth: (user: AuthUser, tokens: AuthTokens) => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  isHydrated: false,
  isLoading: false,

  setAuth: async (user, tokens) => {
    await secureStorage.setItem(STORAGE_KEYS.accessToken, tokens.accessToken);
    await secureStorage.setItem(STORAGE_KEYS.refreshToken, tokens.refreshToken);
    set({ user, tokens, isAuthenticated: true, isLoading: false });
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setLoading: (isLoading) => set({ isLoading }),

  logout: async () => {
    await secureStorage.removeItem(STORAGE_KEYS.accessToken);
    await secureStorage.removeItem(STORAGE_KEYS.refreshToken);
    set({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  hydrate: async () => {
    const accessToken = await secureStorage.getItem(STORAGE_KEYS.accessToken);
    const refreshToken = await secureStorage.getItem(STORAGE_KEYS.refreshToken);
    if (accessToken && refreshToken) {
      set({
        tokens: { accessToken, refreshToken },
        isAuthenticated: true,
        isHydrated: true,
      });
      return;
    }
    set({ isHydrated: true, isAuthenticated: false });
  },
}));
