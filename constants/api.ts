/**
 * API route constants — wire these when backend is ready.
 */
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    forgotPassword: '/auth/forgot-password',
    google: '/auth/google',
    apple: '/auth/apple',
    guest: '/auth/guest',
  },
  documents: {
    list: '/documents',
    upload: '/documents/upload',
    detail: (id: string) => `/documents/${id}`,
    summary: (id: string) => `/documents/${id}/summary`,
  },
  chat: {
    conversations: '/chat/conversations',
    messages: (id: string) => `/chat/conversations/${id}/messages`,
    send: (id: string) => `/chat/conversations/${id}/messages`,
  },
  quiz: {
    list: '/quizzes',
    generate: '/quizzes/generate',
    detail: (id: string) => `/quizzes/${id}`,
    attempt: (id: string) => `/quizzes/${id}/attempt`,
  },
  flashcards: {
    decks: '/flashcards/decks',
    generate: '/flashcards/generate',
    deck: (id: string) => `/flashcards/decks/${id}`,
  },
  planner: {
    tasks: '/planner/tasks',
    sessions: '/planner/sessions',
  },
  subscription: {
    current: '/subscription',
    plans: '/subscription/plans',
  },
} as const;
