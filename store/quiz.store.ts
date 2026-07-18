import { create } from 'zustand';
import type { FlashcardDeck, Quiz, QuizAttempt } from '@/types';

interface QuizStore {
  quizzes: Quiz[];
  activeQuiz: Quiz | null;
  currentIndex: number;
  attempts: QuizAttempt[];
  decks: FlashcardDeck[];
  activeDeck: FlashcardDeck | null;
  setQuizzes: (quizzes: Quiz[]) => void;
  setActiveQuiz: (quiz: Quiz | null) => void;
  setCurrentIndex: (index: number) => void;
  addAttempt: (attempt: QuizAttempt) => void;
  setDecks: (decks: FlashcardDeck[]) => void;
  setActiveDeck: (deck: FlashcardDeck | null) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  quizzes: [],
  activeQuiz: null,
  currentIndex: 0,
  attempts: [],
  decks: [],
  activeDeck: null,
  setQuizzes: (quizzes) => set({ quizzes }),
  setActiveQuiz: (activeQuiz) => set({ activeQuiz, currentIndex: 0 }),
  setCurrentIndex: (currentIndex) => set({ currentIndex }),
  addAttempt: (attempt) => set((state) => ({ attempts: [attempt, ...state.attempts] })),
  setDecks: (decks) => set({ decks }),
  setActiveDeck: (activeDeck) => set({ activeDeck }),
  reset: () =>
    set({
      quizzes: [],
      activeQuiz: null,
      currentIndex: 0,
      attempts: [],
      decks: [],
      activeDeck: null,
    }),
}));
