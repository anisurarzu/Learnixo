/**
 * Authentication & identity domain types.
 */

export type AuthProvider = 'email' | 'google' | 'apple' | 'guest';

/** Access-control roles — architecture ready for RBAC */
export type UserRole = 'guest' | 'student' | 'premium_student' | 'admin';

export type SubscriptionTier = 'free' | 'pro' | 'premium';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string | null;
  photo: string | null;
  provider: AuthProvider;
  isVerified: boolean;
  role: UserRole;
  subscription: SubscriptionTier;
  createdAt: string;
  updatedAt: string;
}

/** Derived display helpers */
export function getUserDisplayName(user: User | null | undefined): string {
  if (!user) return 'Learner';
  const full = `${user.firstName} ${user.lastName}`.trim();
  return full || user.username || 'Learner';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailPayload {
  email: string;
  code: string;
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
  rememberMe: boolean;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'USER_NOT_FOUND'
  | 'EMAIL_EXISTS'
  | 'USERNAME_EXISTS'
  | 'TOKEN_EXPIRED'
  | 'TOO_MANY_REQUESTS'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'UNKNOWN';

export class AuthError extends Error {
  constructor(
    public readonly code: AuthErrorCode,
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/** @deprecated Prefer `User` — kept for gradual migration */
export type AuthUser = User & {
  displayName: string;
  avatarUrl: string | null;
  isGuest: boolean;
};
