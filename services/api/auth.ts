import { API_ENDPOINTS } from '@/constants';
import { apiClient } from './client';
import type {
  AuthTokens,
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
} from '@/types';

/**
 * Auth API stubs — replace implementations when backend is connected.
 */
export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<{ user: AuthUser; tokens: AuthTokens }>(
      API_ENDPOINTS.auth.login,
      credentials,
    ),

  register: (credentials: RegisterCredentials) =>
    apiClient.post<{ user: AuthUser; tokens: AuthTokens }>(
      API_ENDPOINTS.auth.register,
      credentials,
    ),

  logout: () => apiClient.post(API_ENDPOINTS.auth.logout),

  me: () => apiClient.get<AuthUser>(API_ENDPOINTS.auth.me),

  forgotPassword: (email: string) =>
    apiClient.post(API_ENDPOINTS.auth.forgotPassword, { email }),

  google: (idToken: string) =>
    apiClient.post<{ user: AuthUser; tokens: AuthTokens }>(API_ENDPOINTS.auth.google, {
      idToken,
    }),

  apple: (identityToken: string) =>
    apiClient.post<{ user: AuthUser; tokens: AuthTokens }>(API_ENDPOINTS.auth.apple, {
      identityToken,
    }),

  guest: () =>
    apiClient.post<{ user: AuthUser; tokens: AuthTokens }>(API_ENDPOINTS.auth.guest),
};
