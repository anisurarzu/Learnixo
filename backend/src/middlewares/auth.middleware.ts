import type { NextFunction, Response } from 'express';
import { verifyAccessToken } from '../utils/token';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { prisma } from '../database';
import type { AuthenticatedRequest, AuthUserPayload } from '../types';
import type { UserRole } from '@prisma/client';

export async function authenticate(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid Authorization header');
    }

    const token = header.slice(7);
    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User session is invalid');
    }

    const authUser: AuthUserPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      provider: user.provider,
      isVerified: user.isVerified,
      subscriptionTier: user.subscriptionTier,
    };

    req.user = authUser;
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired access token', 'TOKEN_INVALID'));
  }
}

/** Optional auth — attaches user when token present, never fails */
export async function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) {
      const payload = verifyAccessToken(header.slice(7));
      const user = await prisma.user.findUnique({ where: { id: payload.sub } });
      if (user?.isActive) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          provider: user.provider,
          isVerified: user.isVerified,
          subscriptionTier: user.subscriptionTier,
        };
      }
    }
  } catch {
    // ignore
  }
  next();
}

export function requireRoles(...roles: UserRole[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
}

export function requireVerified(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return next(new UnauthorizedError());
  }
  if (req.user.provider === 'EMAIL' && !req.user.isVerified) {
    return next(new ForbiddenError('Please verify your email to continue'));
  }
  next();
}
