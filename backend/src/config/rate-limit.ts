import type { Options as RateLimitOptions } from 'express-rate-limit';
import { env } from './env';

export const globalRateLimitOptions: Partial<RateLimitOptions> = {
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    data: null,
    errors: [{ code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded' }],
  },
};

export const authRateLimitOptions: Partial<RateLimitOptions> = {
  ...globalRateLimitOptions,
  max: env.AUTH_RATE_LIMIT_MAX,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please wait and try again.',
    data: null,
    errors: [{ code: 'TOO_MANY_REQUESTS', message: 'Auth rate limit exceeded' }],
  },
};
