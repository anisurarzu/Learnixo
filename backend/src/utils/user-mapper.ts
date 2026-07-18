import type { User } from '@prisma/client';
import type { PublicUser } from '../interfaces';

export function toPublicUser(user: User): PublicUser {
  const {
    passwordHash: _p,
    emailVerifyToken: _e,
    emailVerifyExpires: _ee,
    passwordResetToken: _r,
    passwordResetExpires: _re,
    ...publicUser
  } = user;
  return publicUser;
}

/** Map Prisma enums to mobile-friendly lowercase strings */
export function mapUserForClient(user: User) {
  const pub = toPublicUser(user);
  return {
    id: pub.id,
    firstName: pub.firstName,
    lastName: pub.lastName,
    username: pub.username,
    email: pub.email,
    photo: pub.photo,
    provider: pub.provider.toLowerCase(),
    isVerified: pub.isVerified,
    role: pub.role.toLowerCase(),
    subscription: pub.subscriptionTier.toLowerCase(),
    createdAt: pub.createdAt.toISOString(),
    updatedAt: pub.updatedAt.toISOString(),
  };
}
