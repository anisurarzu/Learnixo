/**
 * Strict route typings for Learnixo / StudyAI navigation.
 * Params are optional objects unless noted.
 */

export type AuthStackParams = {
  login: undefined;
  register: undefined;
  'forgot-password': undefined;
  'verify-email': { email?: string };
  'reset-password': { token?: string; email?: string };
};

export type OnboardingStackParams = {
  index: undefined;
};

export type TabsParams = {
  index: undefined;
  chat: { conversationId?: string } | undefined;
  documents: undefined;
  planner: undefined;
  profile: undefined;
};

export type AppStackParams = {
  settings: undefined;
  notifications: undefined;
  subscription: undefined;
  summary: { documentId?: string };
  quiz: { quizId?: string; documentId?: string };
  'quiz-result': { quizId: string; score?: number; total?: number };
  flashcards: { deckId?: string; documentId?: string };
  'pdf-viewer': { documentId?: string; uri?: string; title?: string };
  'study-session': { sessionId?: string; documentId?: string };
  search: { query?: string };
  'edit-profile': undefined;
  account: undefined;
  help: undefined;
  about: undefined;
  privacy: undefined;
  terms: undefined;
};

export type ModalStackParams = {
  upload: undefined;
  'share-document': { documentId?: string };
  'delete-confirmation': {
    title?: string;
    message?: string;
    entityId?: string;
    entityType?: string;
  };
  'premium-upgrade': { feature?: string };
};

/** Flat route names used by navigation helpers */
export type AppRoute =
  | '/'
  | '/splash'
  | '/(onboarding)'
  | '/(auth)/login'
  | '/(auth)/register'
  | '/(auth)/forgot-password'
  | '/(auth)/verify-email'
  | '/(auth)/reset-password'
  | '/(app)/(drawer)/(tabs)'
  | '/(app)/(drawer)/(tabs)/'
  | '/(app)/(drawer)/(tabs)/chat'
  | '/(app)/(drawer)/(tabs)/documents'
  | '/(app)/(drawer)/(tabs)/planner'
  | '/(app)/(drawer)/(tabs)/profile'
  | '/(app)/settings'
  | '/(app)/notifications'
  | '/(app)/subscription'
  | '/(app)/summary'
  | '/(app)/quiz'
  | '/(app)/quiz-result'
  | '/(app)/flashcards'
  | '/(app)/pdf-viewer'
  | '/(app)/study-session'
  | '/(app)/search'
  | '/(app)/edit-profile'
  | '/(app)/account'
  | '/(app)/help'
  | '/(app)/about'
  | '/(app)/privacy'
  | '/(app)/terms'
  | '/(modals)/upload'
  | '/(modals)/share-document'
  | '/(modals)/delete-confirmation'
  | '/(modals)/premium-upgrade';

export type RouteParamsMap = {
  '/(auth)/verify-email': AuthStackParams['verify-email'];
  '/(auth)/reset-password': AuthStackParams['reset-password'];
  '/(app)/(drawer)/(tabs)/chat': TabsParams['chat'];
  '/(app)/summary': AppStackParams['summary'];
  '/(app)/quiz': AppStackParams['quiz'];
  '/(app)/quiz-result': AppStackParams['quiz-result'];
  '/(app)/flashcards': AppStackParams['flashcards'];
  '/(app)/pdf-viewer': AppStackParams['pdf-viewer'];
  '/(app)/study-session': AppStackParams['study-session'];
  '/(app)/search': AppStackParams['search'];
  '/(modals)/share-document': ModalStackParams['share-document'];
  '/(modals)/delete-confirmation': ModalStackParams['delete-confirmation'];
  '/(modals)/premium-upgrade': ModalStackParams['premium-upgrade'];
};

export type DeepLinkAlias =
  | 'chat'
  | 'quiz'
  | 'summary'
  | 'profile'
  | 'documents'
  | 'home'
  | 'planner'
  | 'settings'
  | 'upload';
