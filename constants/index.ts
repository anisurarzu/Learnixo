export const APP_NAME = 'StudyAI';
export const APP_TAGLINE = 'Your intelligent study companion';

export const STORAGE_KEYS = {
  accessToken: 'auth.accessToken',
  refreshToken: 'auth.refreshToken',
  themeMode: 'theme.mode',
  onboardingComplete: 'onboarding.complete',
  guestSession: 'auth.guestSession',
} as const;

export const ANIMATION = {
  fast: 150,
  normal: 250,
  slow: 400,
  spring: { damping: 18, stiffness: 180, mass: 0.8 },
} as const;

export * from './api';
