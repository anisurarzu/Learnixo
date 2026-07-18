import rateLimit from 'express-rate-limit';
import { authRateLimitOptions, globalRateLimitOptions } from '../config/rate-limit';

export const globalRateLimiter = rateLimit(globalRateLimitOptions);
export const authRateLimiter = rateLimit(authRateLimitOptions);
