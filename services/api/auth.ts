/**
 * HTTP auth endpoints — used when wiring a real backend.
 * Runtime auth currently goes through `services/auth` (mock).
 */
import { API_ENDPOINTS } from '@/constants';
import { apiClient } from './client';
import type { AuthTokens, LoginCredentials, RegisterCredentials, User } from '@/types';

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<{ user: User; tokens: AuthTokens }>(
      API_ENDPOINTS.auth.login,
      credentials,
    ),

  register: (credentials: RegisterCredentials) =>
    apiClient.post<{ user: User; tokens: AuthTokens }>(
      API_ENDPOINTS.auth.register,
      credentials,
    ),

  logout: () => apiClient.post(API_ENDPOINTS.auth.logout),

  me: () => apiClient.get<User>(API_ENDPOINTS.auth.me),

  forgotPassword: (email: string) =>
    apiClient.post(API_ENDPOINTS.auth.forgotPassword, { email }),

  resetPassword: (payload: {
    email: string;
    otp: string;
    password: string;
    confirmPassword: string;
  }) => apiClient.post(API_ENDPOINTS.auth.resetPassword, payload),

  verifyEmail: (payload: { email: string; code: string }) =>
    apiClient.post<{ user: User; tokens: AuthTokens }>(
      API_ENDPOINTS.auth.verifyEmail,
      payload,
    ),

  resendVerification: (email: string) =>
    apiClient.post(API_ENDPOINTS.auth.resendVerification, { email }),

  google: (idToken: string) =>
    apiClient.post<{ user: User; tokens: AuthTokens }>(API_ENDPOINTS.auth.google, {
      idToken,
    }),

  apple: (identityToken: string) =>
    apiClient.post<{ user: User; tokens: AuthTokens }>(API_ENDPOINTS.auth.apple, {
      identityToken,
    }),

  guest: () =>
    apiClient.post<{ user: User; tokens: AuthTokens }>(API_ENDPOINTS.auth.guest),

  refresh: (refreshToken: string) =>
    apiClient.post<AuthTokens>(API_ENDPOINTS.auth.refresh, { refreshToken }),
};
