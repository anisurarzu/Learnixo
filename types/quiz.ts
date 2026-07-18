export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  documentId?: string;
  title: string;
  difficulty: QuizDifficulty;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  answers: number[];
  completedAt: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  deckId: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  documentId?: string;
  cardCount: number;
  cards: Flashcard[];
  createdAt: string;
}
