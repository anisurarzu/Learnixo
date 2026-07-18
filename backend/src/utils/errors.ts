import { ERROR_CODES, HTTP_STATUS } from '../constants';
import type { ApiErrorItem } from '../types';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly errors: ApiErrorItem[] | null;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL,
    code: string = ERROR_CODES.INTERNAL,
    errors: ApiErrorItem[] | null = null,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors ?? [{ code, message }];
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', code: string = ERROR_CODES.UNAUTHORIZED) {
    super(message, HTTP_STATUS.UNAUTHORIZED, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code: string = ERROR_CODES.CONFLICT) {
    super(message, HTTP_STATUS.CONFLICT, code);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, errors: ApiErrorItem[]) {
    super(message, HTTP_STATUS.UNPROCESSABLE, ERROR_CODES.VALIDATION_ERROR, errors);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, code: string = ERROR_CODES.VALIDATION_ERROR) {
    super(message, HTTP_STATUS.BAD_REQUEST, code);
  }
}
