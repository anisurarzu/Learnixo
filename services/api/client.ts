import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { env } from '@/config/env';
import { STORAGE_KEYS } from '@/constants';
import { authService } from '@/services/auth';
import { authSession } from '@/services/auth/session';
import { secureStorage } from '@/utils/secure-storage';

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosRetry(apiClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    const status = error.response?.status;
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      status === 429 ||
      (status !== undefined && status >= 500)
    );
  },
});

let isRefreshing = false;
let refreshQueue: ((token: string | null) => void)[] = [];

/** Lazy import avoids circular dependency with the auth store */
async function getMemoryAccessToken(): Promise<string | null> {
  try {
    const { useAuthStore } = await import('@/store/auth.store');
    return useAuthStore.getState().tokens?.accessToken ?? null;
  } catch {
    return null;
  }
}

async function getMemoryRefreshToken(): Promise<string | null> {
  try {
    const { useAuthStore } = await import('@/store/auth.store');
    return useAuthStore.getState().tokens?.refreshToken ?? null;
  } catch {
    return null;
  }
}

function flushRefreshQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const stored = await secureStorage.getItem(STORAGE_KEYS.accessToken);
  const token = stored ?? (await getMemoryAccessToken());
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || !original || original._retry) {
      return Promise.reject(normalizeApiError(error));
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((token) => {
          if (!token) {
            reject(normalizeApiError(error));
            return;
          }
          original.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient(original));
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const refreshToken =
        (await secureStorage.getItem(STORAGE_KEYS.refreshToken)) ??
        (await getMemoryRefreshToken());

      if (!refreshToken) {
        flushRefreshQueue(null);
        return Promise.reject(normalizeApiError(error));
      }

      // Uses authService so mock ↔ real backend swap stays in one place
      const tokens = await authService.refreshToken(refreshToken);
      await authSession.updateTokens(tokens);

      try {
        const { useAuthStore } = await import('@/store/auth.store');
        useAuthStore.setState({ tokens });
      } catch {
        // Store may be unavailable during early boot
      }

      flushRefreshQueue(tokens.accessToken);
      original.headers.Authorization = `Bearer ${tokens.accessToken}`;
      return apiClient(original);
    } catch (refreshError) {
      flushRefreshQueue(null);
      await authSession.clear();
      try {
        const { useAuthStore } = await import('@/store/auth.store');
        await useAuthStore.getState().logout();
      } catch {
        // ignore
      }
      return Promise.reject(normalizeApiError(refreshError as AxiosError));
    } finally {
      isRefreshing = false;
    }
  },
);

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; code?: string } | undefined;
    return {
      message: data?.message ?? error.message ?? 'Something went wrong',
      status: error.response?.status,
      code: data?.code,
      details: error.response?.data,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: 'Unexpected error' };
}
