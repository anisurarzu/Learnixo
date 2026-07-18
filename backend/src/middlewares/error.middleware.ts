import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { MulterError } from 'multer';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';
import { ERROR_CODES, HTTP_STATUS } from '../constants';
import { isProd } from '../config/env';
import type { ApiErrorItem } from '../types';

export function notFoundHandler(_req: Request, res: Response) {
  return sendError(res, 'Route not found', HTTP_STATUS.NOT_FOUND, [
    { code: ERROR_CODES.NOT_FOUND, message: 'Route not found' },
  ]);
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(err.message, { code: err.code, stack: err.stack });
    }
    return sendError(res, err.message, err.statusCode, err.errors);
  }

  if (err instanceof ZodError) {
    const errors: ApiErrorItem[] = err.errors.map((e) => ({
      code: ERROR_CODES.VALIDATION_ERROR,
      message: e.message,
      field: e.path.join('.'),
    }));
    return sendError(res, 'Validation failed', HTTP_STATUS.UNPROCESSABLE, errors);
  }

  if (err instanceof MulterError) {
    const code =
      err.code === 'LIMIT_FILE_SIZE'
        ? ERROR_CODES.FILE_TOO_LARGE
        : ERROR_CODES.VALIDATION_ERROR;
    return sendError(res, err.message, HTTP_STATUS.BAD_REQUEST, [
      { code, message: err.message },
    ]);
  }

  logger.error('Unhandled error', {
    message: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });

  return sendError(
    res,
    isProd
      ? 'Internal server error'
      : err instanceof Error
        ? err.message
        : 'Internal server error',
    HTTP_STATUS.INTERNAL,
    [{ code: ERROR_CODES.INTERNAL, message: 'Internal server error' }],
  );
}
