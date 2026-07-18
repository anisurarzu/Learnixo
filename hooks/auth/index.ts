/**
 * Auth hooks — thin wrappers around the Zustand auth store / services.
 */
import { useCallback, useState } from 'react';
import { useAuthStore } from '@/store';
import { authService } from '@/services/auth';
import { toAuthError } from '@/services/auth/errors';
import type {
  ForgotPasswordPayload,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from '@/types';

export function useLogin() {
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  return { login, isLoading, error };
}

export function useRegister() {
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  return { register, isLoading, error };
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const isLoading = useAuthStore((s) => s.isLoading);
  return { logout, isLoading };
}

export function useSocialAuth() {
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const loginWithApple = useAuthStore((s) => s.loginWithApple);
  const loginAsGuest = useAuthStore((s) => s.loginAsGuest);
  const isLoading = useAuthStore((s) => s.isLoading);
  return { loginWithGoogle, loginWithApple, loginAsGuest, isLoading };
}

export function useAuthSession() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const hydrate = useAuthStore((s) => s.hydrate);
  const refreshSession = useAuthStore((s) => s.refreshSession);
  return { user, isAuthenticated, isHydrated, hydrate, refreshSession };
}

export function useForgotPassword() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forgotPassword = useCallback(async (payload: ForgotPasswordPayload) => {
    setLoading(true);
    setError(null);
    try {
      return await authService.forgotPassword(payload);
    } catch (err) {
      const authErr = toAuthError(err);
      setError(authErr.message);
      throw authErr;
    } finally {
      setLoading(false);
    }
  }, []);

  return { forgotPassword, isLoading, error };
}

export function useResetPassword() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPassword = useCallback(async (payload: ResetPasswordPayload) => {
    setLoading(true);
    setError(null);
    try {
      return await authService.resetPassword(payload);
    } catch (err) {
      const authErr = toAuthError(err);
      setError(authErr.message);
      throw authErr;
    } finally {
      setLoading(false);
    }
  }, []);

  return { resetPassword, isLoading, error };
}

export function useVerifyEmail() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const establishSession = useAuthStore((s) => s.establishSession);

  const verifyEmail = useCallback(
    async (payload: VerifyEmailPayload) => {
      setLoading(true);
      setError(null);
      try {
        const result = await authService.verifyEmail(payload);
        await establishSession(result.user, result.tokens, true);
        return result;
      } catch (err) {
        const authErr = toAuthError(err);
        setError(authErr.message);
        throw authErr;
      } finally {
        setLoading(false);
      }
    },
    [establishSession],
  );

  return { verifyEmail, isLoading, error };
}

/** Access-control helpers — architecture ready */
export function useAccessControl() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? 'guest';

  return {
    role,
    isGuest: role === 'guest' || user?.provider === 'guest',
    isStudent: role === 'student' || role === 'premium_student' || role === 'admin',
    isPremium: role === 'premium_student' || role === 'admin',
    isAdmin: role === 'admin',
    canAccessPremium: role === 'premium_student' || role === 'admin',
  };
}
