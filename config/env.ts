import Constants from 'expo-constants';

/**
 * Environment configuration.
 * Values come from app.config / expo-constants extra, or process.env for Expo.
 */
type ExtraConfig = {
  apiUrl?: string;
  appEnv?: string;
  enableAnalytics?: boolean;
};

const extra = (Constants.expoConfig?.extra ?? {}) as ExtraConfig;

export const env = {
  apiUrl: extra.apiUrl ?? process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com',
  appEnv: extra.appEnv ?? process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
  enableAnalytics:
    extra.enableAnalytics ?? process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
  isDev: __DEV__,
  isProd:
    (extra.appEnv ?? process.env.EXPO_PUBLIC_APP_ENV ?? 'development') === 'production',
} as const;

export type Env = typeof env;
