import type { Request } from 'express';
import type { UserRole, AuthProvider, SubscriptionTier } from '@prisma/client';

export interface AuthUserPayload {
  id: string;
  email: string | null;
  role: UserRole;
  provider: AuthProvider;
  isVerified: boolean;
  subscriptionTier: SubscriptionTier;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
  requestId?: string;
}

export interface AccessTokenPayload {
  sub: string;
  email: string | null;
  role: UserRole;
  provider: AuthProvider;
  type: 'access';
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
  type: 'refresh';
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiErrorItem {
  code: string;
  message: string;
  field?: string;
}

export interface ApiResponseBody<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  errors: ApiErrorItem[] | null;
}
