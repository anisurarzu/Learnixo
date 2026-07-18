/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication & session management
 */

import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { asyncHandler } from '../utils/async-handler';
import { authenticate, authRateLimiter, validate } from '../middlewares';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  refreshTokenSchema,
} from '../validators';
import { z } from 'zod';

const router = Router();

router.use(authRateLimiter);

router.post('/register', validate(registerSchema), asyncHandler(authController.register));
router.post('/login', validate(loginSchema), asyncHandler(authController.login));
router.post('/logout', asyncHandler(authController.logout));
router.post(
  '/refresh',
  validate(refreshTokenSchema),
  asyncHandler(authController.refresh),
);
router.get('/me', authenticate, asyncHandler(authController.me));

router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  asyncHandler(authController.forgotPassword),
);
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  asyncHandler(authController.resetPassword),
);
router.post(
  '/verify-email',
  validate(verifyEmailSchema),
  asyncHandler(authController.verifyEmail),
);
router.post(
  '/resend-verification',
  validate(resendVerificationSchema),
  asyncHandler(authController.resendVerification),
);

router.post('/guest', asyncHandler(authController.guest));
router.post(
  '/google',
  validate(z.object({ idToken: z.string().min(1) })),
  asyncHandler(authController.google),
);
router.post(
  '/apple',
  validate(z.object({ idToken: z.string().min(1) })),
  asyncHandler(authController.apple),
);

export default router;
