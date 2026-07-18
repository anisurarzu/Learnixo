import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { ValidationError } from '../utils/errors';
import { ERROR_CODES } from '../constants';

type RequestTarget = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, target: RequestTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        code: ERROR_CODES.VALIDATION_ERROR,
        message: e.message,
        field: e.path.join('.'),
      }));
      return next(new ValidationError('Validation failed', errors));
    }
    req[target] = result.data;
    next();
  };
}
