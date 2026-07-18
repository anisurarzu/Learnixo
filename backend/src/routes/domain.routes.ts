import { Router } from 'express';
import { healthController } from '../controllers/health.controller';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess } from '../utils/response';
import { authenticate } from '../middlewares';

/**
 * Placeholder routers for domain modules — ready for feature implementation.
 */
export const healthRouter = Router();
healthRouter.get('/', asyncHandler(healthController.check));

function stubRouter(resource: string) {
  const r = Router();
  r.use(authenticate);
  r.get('/', (_req, res) =>
    sendSuccess(res, { items: [] }, `${resource} list stub — coming soon`),
  );
  return r;
}

export const subjectsRouter = stubRouter('Subjects');
export const conversationsRouter = stubRouter('Conversations');
export const quizzesRouter = stubRouter('Quizzes');
export const flashcardsRouter = stubRouter('Flashcards');
export const studySessionsRouter = stubRouter('Study sessions');
export const notificationsRouter = stubRouter('Notifications');
export const subscriptionsRouter = stubRouter('Subscriptions');
