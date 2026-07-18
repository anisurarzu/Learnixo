import { create } from 'zustand';
import { authService } from '@/services/auth';
import { authSession } from '@/services/auth/session';
import { toAuthError } from '@/services/auth/errors';
import type {
  AuthErrorCode,
  AuthTokens,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '@/types';
import { userToProfile } from '@/types/user';
import { useUserStore } from './user.store';

interface AuthStore {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  errorCode: AuthErrorCode | null;
  rememberMe: boolean;

  setError: (message: string | null, code?: AuthErrorCode | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;

  /** Persist or ephemeral session after successful auth */
  establishSession: (
    user: User,
    tokens: AuthTokens,
    rememberMe?: boolean,
  ) => Promise<void>;

  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  loginWithApple: () => Promise<User>;
  loginAsGuest: () => Promise<User>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  restoreSession: () => Promise<void>;
  hydrate: () => Promise<void>;
  setUser: (user: User) => Promise<void>;
}

let refreshInFlight: Promise<boolean> | null = null;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  isHydrated: false,
  isLoading: false,
  error: null,
  errorCode: null,
  rememberMe: true,

  setError: (message, code = null) => set({ error: message, errorCode: code }),
  clearError: () => set({ error: null, errorCode: null }),
  setLoading: (isLoading) => set({ isLoading }),

  establishSession: async (user, tokens, rememberMe = true) => {
    if (rememberMe) {
      await authSession.save({ user, tokens, rememberMe: true });
    } else {
      await authSession.saveEphemeral(user, tokens);
    }
    useUserStore.getState().setProfile(userToProfile(user));
    set({
      user,
      tokens,
      isAuthenticated: true,
      rememberMe,
      isLoading: false,
      error: null,
      errorCode: null,
    });
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null, errorCode: null });
    try {
      const { user, tokens } = await authService.login(credentials);
      await get().establishSession(user, tokens, credentials.rememberMe ?? true);
      return user;
    } catch (err) {
      const authErr = toAuthError(err);
      set({
        isLoading: false,
        error: authErr.message,
        errorCode: authErr.code,
        isAuthenticated: false,
      });
      throw authErr;
    }
  },

  register: async (credentials) => {
    set({ isLoading: true, error: null, errorCode: null });
    try {
      const { user, tokens } = await authService.register(credentials);
      await get().establishSession(user, tokens, true);
      return user;
    } catch (err) {
      const authErr = toAuthError(err);
      set({
        isLoading: false,
        error: authErr.message,
        errorCode: authErr.code,
      });
      throw authErr;
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null, errorCode: null });
    try {
      const { user, tokens } = await authService.googleSignIn();
      await get().establishSession(user, tokens, true);
      return user;
    } catch (err) {
      const authErr = toAuthError(err);
      set({ isLoading: false, error: authErr.message, errorCode: authErr.code });
      throw authErr;
    }
  },

  loginWithApple: async () => {
    set({ isLoading: true, error: null, errorCode: null });
    try {
      const { user, tokens } = await authService.appleSignIn();
      await get().establishSession(user, tokens, true);
      return user;
    } catch (err) {
      const authErr = toAuthError(err);
      set({ isLoading: false, error: authErr.message, errorCode: authErr.code });
      throw authErr;
    }
  },

  loginAsGuest: async () => {
    set({ isLoading: true, error: null, errorCode: null });
    try {
      const { user, tokens } = await authService.guestLogin();
      // Guest sessions are ephemeral by default
      await get().establishSession(user, tokens, false);
      // Keep tokens in memory for guest API calls
      set({ tokens, user, isAuthenticated: true });
      return user;
    } catch (err) {
      const authErr = toAuthError(err);
      set({ isLoading: false, error: authErr.message, errorCode: authErr.code });
      throw authErr;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    const refresh = get().tokens?.refreshToken;
    try {
      await authService.logout(refresh);
    } catch {
      // Always clear local session
    }
    await authSession.clear();
    useUserStore.getState().reset();
    set({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      errorCode: null,
    });
  },

  refreshSession: async () => {
    if (refreshInFlight) return refreshInFlight;

    refreshInFlight = (async () => {
      const current = get().tokens?.refreshToken;
      if (!current) return false;
      try {
        const tokens = await authService.refreshToken(current);
        if (get().rememberMe) {
          await authSession.updateTokens(tokens);
        }
        set({ tokens, error: null, errorCode: null });
        return true;
      } catch {
        await get().logout();
        return false;
      } finally {
        refreshInFlight = null;
      }
    })();

    return refreshInFlight;
  },

  restoreSession: async () => {
    const session = await authSession.load();
    if (!session) {
      set({ isAuthenticated: false, user: null, tokens: null });
      return;
    }

    // Refresh if access token near expiry
    const nearExpiry = session.tokens.expiresAt < Date.now() + 60_000;
    set({
      user: session.user,
      tokens: session.tokens,
      rememberMe: session.rememberMe,
      isAuthenticated: true,
    });
    useUserStore.getState().setProfile(userToProfile(session.user));

    if (nearExpiry) {
      await get().refreshSession();
    } else {
      try {
        const user = await authService.getCurrentUser(session.tokens.accessToken);
        await authSession.updateUser(user);
        useUserStore.getState().setProfile(userToProfile(user));
        set({ user });
      } catch {
        await get().refreshSession();
      }
    }
  },

  hydrate: async () => {
    try {
      await get().restoreSession();
    } finally {
      set({ isHydrated: true });
    }
  },

  setUser: async (user) => {
    if (get().rememberMe) {
      await authSession.updateUser(user);
    }
    useUserStore.getState().setProfile(userToProfile(user));
    set({ user });
  },
}));
