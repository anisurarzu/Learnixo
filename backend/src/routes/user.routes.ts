import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { asyncHandler } from '../utils/async-handler';
import { authenticate, validate } from '../middlewares';
import { updateProfileSchema } from '../validators';

const router = Router();

router.use(authenticate);

router.get('/me', asyncHandler(userController.getProfile));
router.patch(
  '/me',
  validate(updateProfileSchema),
  asyncHandler(userController.updateProfile),
);

export default router;
