/**
 * Domain model re-exports from Prisma — keep API layer decoupled from @prisma/client imports.
 */
export type {
  User,
  Subject,
  Document,
  Chat,
  Conversation,
  Quiz,
  Question,
  Answer,
  Flashcard,
  StudySession,
  Notification,
  Subscription,
  RefreshToken,
  AuthProvider,
  UserRole,
  SubscriptionTier,
  SubscriptionStatus,
  DocumentStatus,
  DocumentType,
  QuizDifficulty,
  NotificationType,
} from '@prisma/client';
