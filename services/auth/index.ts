/**
 * Public auth service API.
 * Currently delegates to the mock backend — replace internals with Axios calls later.
 */

import type {
  AuthResponse,
  AuthTokens,
  ForgotPasswordPayload,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordPayload,
  User,
  VerifyEmailPayload,
} from '@/types';
import { mockAuthBackend } from './mock-auth.service';

export const authService = {
  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    mockAuthBackend.login(credentials),

  register: (credentials: RegisterCredentials): Promise<AuthResponse> =>
    mockAuthBackend.register(credentials),

  logout: (refreshToken?: string): Promise<void> => mockAuthBackend.logout(refreshToken),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    mockAuthBackend.forgotPassword(payload),

  resetPassword: (payload: ResetPasswordPayload) =>
    mockAuthBackend.resetPassword(payload),

  verifyEmail: (payload: VerifyEmailPayload): Promise<AuthResponse> =>
    mockAuthBackend.verifyEmail(payload),

  resendVerification: (email: string) => mockAuthBackend.resendVerification(email),

  refreshToken: (refreshToken: string): Promise<AuthTokens> =>
    mockAuthBackend.refreshToken(refreshToken),

  getCurrentUser: (accessToken: string): Promise<User> =>
    mockAuthBackend.getCurrentUser(accessToken),

  googleSignIn: (): Promise<AuthResponse> => mockAuthBackend.socialLogin('google'),

  appleSignIn: (): Promise<AuthResponse> => mockAuthBackend.socialLogin('apple'),

  guestLogin: (): Promise<AuthResponse> => mockAuthBackend.guestLogin(),
};
