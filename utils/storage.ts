/**
 * Optional MMKV-backed cache with in-memory fallback.
 * MMKV requires a development build — safe to use when available.
 */

type StorageLike = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string | number | boolean) => void;
  delete: (key: string) => void;
  clearAll: () => void;
};

class MemoryStorage implements StorageLike {
  private store = new Map<string, string>();

  getString(key: string) {
    return this.store.get(key);
  }

  set(key: string, value: string | number | boolean) {
    this.store.set(key, String(value));
  }

  delete(key: string) {
    this.store.delete(key);
  }

  clearAll() {
    this.store.clear();
  }
}

function createStorage(): StorageLike {
  try {
    // Dynamic require keeps Expo Go from crashing when MMKV isn't linked

    const { MMKV } = require('react-native-mmkv') as {
      MMKV: new (options?: { id?: string }) => StorageLike;
    };
    return new MMKV({ id: 'ai-study-assistant' });
  } catch {
    return new MemoryStorage();
  }
}

export const cacheStorage = createStorage();

export const cache = {
  getJSON<T>(key: string): T | null {
    const raw = cacheStorage.getString(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  setJSON(key: string, value: unknown): void {
    cacheStorage.set(key, JSON.stringify(value));
  },

  remove(key: string): void {
    cacheStorage.delete(key);
  },

  clear(): void {
    cacheStorage.clearAll();
  },
};
