import type { Response } from 'express';
import type { ApiErrorItem, ApiResponseBody } from '../types';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  status = 200,
): Response {
  const body: ApiResponseBody<T> = {
    success: true,
    message,
    data,
    errors: null,
  };
  return res.status(status).json(body);
}

export function sendCreated<T>(res: Response, data: T, message = 'Created'): Response {
  return sendSuccess(res, data, message, 201);
}

export function sendError(
  res: Response,
  message: string,
  status = 500,
  errors: ApiErrorItem[] | null = null,
): Response {
  const body: ApiResponseBody<null> = {
    success: false,
    message,
    data: null,
    errors,
  };
  return res.status(status).json(body);
}
