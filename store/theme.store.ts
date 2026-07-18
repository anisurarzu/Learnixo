import { create } from 'zustand';
import { STORAGE_KEYS } from '@/constants';
import type { ThemeMode } from '@/theme';
import { cache } from '@/utils/storage';

interface ThemeStore {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  hydrate: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: 'system',

  setMode: (mode) => {
    cache.setJSON(STORAGE_KEYS.themeMode, mode);
    set({ mode });
  },

  hydrate: () => {
    const stored = cache.getJSON<ThemeMode>(STORAGE_KEYS.themeMode);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      set({ mode: stored });
    }
  },
}));
