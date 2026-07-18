import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import documentRoutes from './document.routes';
import {
  healthRouter,
  subjectsRouter,
  conversationsRouter,
  quizzesRouter,
  flashcardsRouter,
  studySessionsRouter,
  notificationsRouter,
  subscriptionsRouter,
} from './domain.routes';

const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/documents', documentRoutes);
router.use('/subjects', subjectsRouter);
router.use('/conversations', conversationsRouter);
router.use('/quizzes', quizzesRouter);
router.use('/flashcards', flashcardsRouter);
router.use('/study-sessions', studySessionsRouter);
router.use('/notifications', notificationsRouter);
router.use('/subscriptions', subscriptionsRouter);

export default router;
