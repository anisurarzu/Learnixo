import { Router } from 'express';
import { documentController } from '../controllers/document.controller';
import { aiStubController } from '../controllers/health.controller';
import { asyncHandler } from '../utils/async-handler';
import { authenticate, upload, validate } from '../middlewares';
import { uuidParamSchema, paginationSchema } from '../validators';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  validate(paginationSchema, 'query'),
  asyncHandler(documentController.list),
);
router.post('/upload', upload.single('file'), asyncHandler(documentController.upload));
router.get(
  '/:id',
  validate(uuidParamSchema, 'params'),
  asyncHandler(documentController.getById),
);
router.delete(
  '/:id',
  validate(uuidParamSchema, 'params'),
  asyncHandler(documentController.remove),
);

/** AI stubs — architecture only */
router.post(
  '/:id/summarize',
  validate(uuidParamSchema, 'params'),
  asyncHandler(aiStubController.summarize),
);

export default router;
