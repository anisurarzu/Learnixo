import { AuthError, type AuthErrorCode } from '@/types';

const MESSAGES: Record<AuthErrorCode, string> = {
  INVALID_CREDENTIALS: 'Incorrect email or password. Please try again.',
  NETWORK_ERROR: 'Network error. Check your connection and try again.',
  TIMEOUT: 'The request timed out. Please try again.',
  USER_NOT_FOUND: 'No account found with this email.',
  EMAIL_EXISTS: 'An account with this email already exists.',
  USERNAME_EXISTS: 'This username is already taken.',
  TOKEN_EXPIRED: 'Your session has expired. Please sign in again.',
  TOO_MANY_REQUESTS: 'Too many attempts. Please wait a moment and try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  UNKNOWN: 'Something went wrong. Please try again.',
};

export function getAuthErrorMessage(code: AuthErrorCode): string {
  return MESSAGES[code] ?? MESSAGES.UNKNOWN;
}

export function toAuthError(error: unknown): AuthError {
  if (error instanceof AuthError) return error;
  if (error instanceof Error) {
    return new AuthError('UNKNOWN', error.message);
  }
  return new AuthError('UNKNOWN', MESSAGES.UNKNOWN);
}
