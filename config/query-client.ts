import { QueryClient } from '@tanstack/react-query';

/**
 * Shared React Query client — tuned for mobile with sensible defaults.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

/** Query key factory for consistent cache keys */
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  documents: {
    all: ['documents'] as const,
    detail: (id: string) => ['documents', id] as const,
    summary: (id: string) => ['documents', id, 'summary'] as const,
  },
  chat: {
    conversations: ['chat', 'conversations'] as const,
    messages: (id: string) => ['chat', 'messages', id] as const,
  },
  quiz: {
    all: ['quiz'] as const,
    detail: (id: string) => ['quiz', id] as const,
  },
  flashcards: {
    decks: ['flashcards', 'decks'] as const,
    deck: (id: string) => ['flashcards', 'decks', id] as const,
  },
  planner: {
    tasks: ['planner', 'tasks'] as const,
    sessions: ['planner', 'sessions'] as const,
  },
  subscription: {
    current: ['subscription', 'current'] as const,
    plans: ['subscription', 'plans'] as const,
  },
} as const;
