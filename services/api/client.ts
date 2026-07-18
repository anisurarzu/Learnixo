import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { env } from '@/config/env';
import { API_ENDPOINTS, STORAGE_KEYS } from '@/constants';
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

function flushRefreshQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await secureStorage.getItem(STORAGE_KEYS.accessToken);
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
      const refreshToken = await secureStorage.getItem(STORAGE_KEYS.refreshToken);
      if (!refreshToken) {
        flushRefreshQueue(null);
        return Promise.reject(normalizeApiError(error));
      }

      const { data } = await axios.post(`${env.apiUrl}${API_ENDPOINTS.auth.refresh}`, {
        refreshToken,
      });

      const accessToken = data.accessToken as string;
      const nextRefresh = (data.refreshToken as string) ?? refreshToken;

      await secureStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
      await secureStorage.setItem(STORAGE_KEYS.refreshToken, nextRefresh);

      flushRefreshQueue(accessToken);
      original.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(original);
    } catch (refreshError) {
      flushRefreshQueue(null);
      await secureStorage.removeItem(STORAGE_KEYS.accessToken);
      await secureStorage.removeItem(STORAGE_KEYS.refreshToken);
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
