import type { AppRoute, DeepLinkAlias } from '@/types/navigation';

/**
 * Central route path constants — single source of truth for hrefs.
 */
export const ROUTES = {
  root: '/' as const,
  splash: '/splash' as const,

  onboarding: '/(onboarding)' as const,

  auth: {
    login: '/(auth)/login' as const,
    register: '/(auth)/register' as const,
    forgotPassword: '/(auth)/forgot-password' as const,
    verifyEmail: '/(auth)/verify-email' as const,
    resetPassword: '/(auth)/reset-password' as const,
  },

  tabs: {
    home: '/(app)/(drawer)/(tabs)' as const,
    chat: '/(app)/(drawer)/(tabs)/chat' as const,
    documents: '/(app)/(drawer)/(tabs)/documents' as const,
    planner: '/(app)/(drawer)/(tabs)/planner' as const,
    profile: '/(app)/(drawer)/(tabs)/profile' as const,
  },

  app: {
    settings: '/(app)/settings' as const,
    notifications: '/(app)/notifications' as const,
    subscription: '/(app)/subscription' as const,
    summary: '/(app)/summary' as const,
    quiz: '/(app)/quiz' as const,
    quizResult: '/(app)/quiz-result' as const,
    flashcards: '/(app)/flashcards' as const,
    pdfViewer: '/(app)/pdf-viewer' as const,
    studySession: '/(app)/study-session' as const,
    search: '/(app)/search' as const,
    editProfile: '/(app)/edit-profile' as const,
    account: '/(app)/account' as const,
    help: '/(app)/help' as const,
    about: '/(app)/about' as const,
    privacy: '/(app)/privacy' as const,
    terms: '/(app)/terms' as const,
  },

  modals: {
    upload: '/(modals)/upload' as const,
    shareDocument: '/(modals)/share-document' as const,
    deleteConfirmation: '/(modals)/delete-confirmation' as const,
    premiumUpgrade: '/(modals)/premium-upgrade' as const,
  },
} as const;

/** Public routes accessible without authentication */
export const PUBLIC_ROUTES: readonly AppRoute[] = [
  ROUTES.splash,
  ROUTES.onboarding,
  ROUTES.auth.login,
  ROUTES.auth.register,
  ROUTES.auth.forgotPassword,
  ROUTES.auth.verifyEmail,
  ROUTES.auth.resetPassword,
] as AppRoute[];

/** Deep-link alias → internal Expo Router path */
export const DEEP_LINK_MAP: Record<DeepLinkAlias, AppRoute> = {
  home: ROUTES.tabs.home,
  chat: ROUTES.tabs.chat,
  documents: ROUTES.tabs.documents,
  planner: ROUTES.tabs.planner,
  profile: ROUTES.tabs.profile,
  quiz: ROUTES.app.quiz,
  summary: ROUTES.app.summary,
  settings: ROUTES.app.settings,
  upload: ROUTES.modals.upload,
};

export const APP_SCHEME = 'studyai';
export const APP_SCHEME_LEGACY = 'aistudyassistant';
