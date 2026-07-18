import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Secure token storage via Expo Secure Store.
 * Falls back to in-memory map on web (SecureStore is native-only).
 */
const memoryStore = new Map<string, string>();

const isSecureStoreAvailable = Platform.OS !== 'web';

export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    if (!isSecureStoreAvailable) {
      return memoryStore.get(key) ?? null;
    }
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    if (!isSecureStoreAvailable) {
      memoryStore.set(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },

  async removeItem(key: string): Promise<void> {
    if (!isSecureStoreAvailable) {
      memoryStore.delete(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};
