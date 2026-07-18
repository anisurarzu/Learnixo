import { STORAGE_KEYS } from '@/constants';
import type { AuthSession, AuthTokens, User } from '@/types';
import { secureStorage } from '@/utils/secure-storage';

const USER_KEY = 'auth.user';
const REMEMBER_KEY = 'auth.rememberMe';

/**
 * Persists auth session in Expo Secure Store (never AsyncStorage for tokens).
 */
export const authSession = {
  async save(session: AuthSession): Promise<void> {
    await Promise.all([
      secureStorage.setItem(STORAGE_KEYS.accessToken, session.tokens.accessToken),
      secureStorage.setItem(STORAGE_KEYS.refreshToken, session.tokens.refreshToken),
      secureStorage.setItem(USER_KEY, JSON.stringify(session.user)),
      secureStorage.setItem(REMEMBER_KEY, session.rememberMe ? '1' : '0'),
      secureStorage.setItem('auth.expiresAt', String(session.tokens.expiresAt)),
    ]);
  },

  /** Memory-only session when Remember Me is off — clears persisted secrets */
  async saveEphemeral(user: User, tokens: AuthTokens): Promise<void> {
    await this.clear();
    await secureStorage.setItem(REMEMBER_KEY, '0');
    // Keep tokens only for the current process via caller store; nothing durable.
    void user;
    void tokens;
  },

  async load(): Promise<AuthSession | null> {
    const remember = await secureStorage.getItem(REMEMBER_KEY);
    if (remember === '0') {
      return null;
    }

    const [accessToken, refreshToken, userRaw, expiresRaw] = await Promise.all([
      secureStorage.getItem(STORAGE_KEYS.accessToken),
      secureStorage.getItem(STORAGE_KEYS.refreshToken),
      secureStorage.getItem(USER_KEY),
      secureStorage.getItem('auth.expiresAt'),
    ]);

    if (!accessToken || !refreshToken || !userRaw) {
      return null;
    }

    try {
      const user = JSON.parse(userRaw) as User;
      return {
        user,
        tokens: {
          accessToken,
          refreshToken,
          expiresAt: Number(expiresRaw) || Date.now() + 60 * 60 * 1000,
        },
        rememberMe: true,
      };
    } catch {
      await this.clear();
      return null;
    }
  },

  async updateTokens(tokens: AuthTokens): Promise<void> {
    await Promise.all([
      secureStorage.setItem(STORAGE_KEYS.accessToken, tokens.accessToken),
      secureStorage.setItem(STORAGE_KEYS.refreshToken, tokens.refreshToken),
      secureStorage.setItem('auth.expiresAt', String(tokens.expiresAt)),
    ]);
  },

  async updateUser(user: User): Promise<void> {
    await secureStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  async clear(): Promise<void> {
    await Promise.all([
      secureStorage.removeItem(STORAGE_KEYS.accessToken),
      secureStorage.removeItem(STORAGE_KEYS.refreshToken),
      secureStorage.removeItem(USER_KEY),
      secureStorage.removeItem(REMEMBER_KEY),
      secureStorage.removeItem('auth.expiresAt'),
    ]);
  },
};
