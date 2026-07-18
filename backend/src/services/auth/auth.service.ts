import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { AuthProvider, UserRole, SubscriptionTier } from '@prisma/client';
import { env, isDev } from '../../config/env';
import { ERROR_CODES } from '../../constants';
import { userRepository, refreshTokenRepository } from '../../repositories';
import { emailService } from '../email/email.service';
import {
  ConflictError,
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
} from '../../utils/errors';
import {
  generateOtp,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  parseExpiryToMs,
} from '../../utils/token';
import { addMinutes, isExpired } from '../../utils/date';
import { mapUserForClient } from '../../utils/user-mapper';
import { logger } from '../../utils/logger';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from '../../validators/auth.validators';

export class AuthService {
  async register(input: RegisterInput) {
    if (await userRepository.emailExists(input.email)) {
      throw new ConflictError(
        'An account with this email already exists.',
        ERROR_CODES.EMAIL_EXISTS,
      );
    }
    if (await userRepository.usernameExists(input.username)) {
      throw new ConflictError(
        'This username is already taken.',
        ERROR_CODES.USERNAME_EXISTS,
      );
    }

    const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
    const verifyCode = generateOtp();
    const verifyHash = hashToken(verifyCode);

    const user = await userRepository.create({
      firstName: input.firstName,
      lastName: input.lastName,
      username: input.username,
      email: input.email,
      passwordHash,
      provider: AuthProvider.EMAIL,
      role: UserRole.STUDENT,
      subscriptionTier: SubscriptionTier.FREE,
      isVerified: false,
      emailVerifyToken: verifyHash,
      emailVerifyExpires: addMinutes(new Date(), env.EMAIL_VERIFICATION_EXPIRES_MIN),
      subscription: {
        create: { tier: SubscriptionTier.FREE },
      },
    });

    await emailService.sendVerificationEmail(input.email, verifyCode);
    if (isDev) {
      logger.auth(`[dev] verify code for ${input.email}: ${verifyCode}`);
    }

    const tokens = await this.issueTokens(user.id, user.email, user.role, user.provider);

    logger.auth('User registered', { userId: user.id, email: user.email });

    return {
      user: mapUserForClient(user),
      tokens,
      requiresVerification: true,
    };
  }

  async login(input: LoginInput, meta?: { userAgent?: string; ip?: string }) {
    const user = await userRepository.findByEmail(input.email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedError(
        'Incorrect email or password.',
        ERROR_CODES.INVALID_CREDENTIALS,
      );
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError(
        'Incorrect email or password.',
        ERROR_CODES.INVALID_CREDENTIALS,
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated.');
    }

    await userRepository.update(user.id, { lastLoginAt: new Date() });

    const tokens = await this.issueTokens(
      user.id,
      user.email,
      user.role,
      user.provider,
      meta,
      input.rememberMe !== false,
    );

    logger.auth('User logged in', { userId: user.id });

    return { user: mapUserForClient(user), tokens };
  }

  async logout(refreshToken?: string, userId?: string) {
    if (refreshToken) {
      const stored = await refreshTokenRepository.findByToken(hashToken(refreshToken));
      if (stored) {
        await refreshTokenRepository.revoke(stored.id);
      }
    } else if (userId) {
      await refreshTokenRepository.revokeAllForUser(userId);
    }
    logger.auth('User logged out', { userId });
  }

  async refresh(rawRefreshToken: string) {
    let payload;
    try {
      payload = verifyRefreshToken(rawRefreshToken);
    } catch {
      throw new UnauthorizedError(
        'Refresh token is invalid or expired.',
        ERROR_CODES.TOKEN_EXPIRED,
      );
    }

    const tokenHash = hashToken(rawRefreshToken);
    const stored = await refreshTokenRepository.findValidByToken(tokenHash);
    if (!stored || stored.userId !== payload.sub) {
      throw new UnauthorizedError(
        'Refresh token is invalid or expired.',
        ERROR_CODES.TOKEN_EXPIRED,
      );
    }

    // Rotate: revoke old, issue new
    await refreshTokenRepository.revoke(stored.id);

    const user = await userRepository.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User session is invalid.');
    }

    return this.issueTokens(user.id, user.email, user.role, user.provider);
  }

  async getCurrentUser(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return mapUserForClient(user);
  }

  async forgotPassword(input: ForgotPasswordInput) {
    const user = await userRepository.findByEmail(input.email);
    // Always return success to avoid email enumeration
    if (user?.email) {
      const code = generateOtp();
      await userRepository.update(user.id, {
        passwordResetToken: hashToken(code),
        passwordResetExpires: addMinutes(new Date(), env.PASSWORD_RESET_EXPIRES_MIN),
      });
      await emailService.sendPasswordResetEmail(user.email, code);
      if (isDev) {
        logger.auth(`[dev] reset code for ${user.email}: ${code}`);
      }
    }
    return { message: 'If an account exists, a reset code was sent.' };
  }

  async resetPassword(input: ResetPasswordInput) {
    const user = await userRepository.findByEmail(input.email);
    if (!user || !user.passwordResetToken || isExpired(user.passwordResetExpires)) {
      throw new BadRequestError('Invalid or expired reset code.');
    }

    if (user.passwordResetToken !== hashToken(input.otp)) {
      throw new BadRequestError('Invalid or expired reset code.');
    }

    const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
    await userRepository.update(user.id, {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
    });
    await refreshTokenRepository.revokeAllForUser(user.id);

    logger.auth('Password reset', { userId: user.id });
    return { message: 'Password updated successfully.' };
  }

  async verifyEmail(input: VerifyEmailInput) {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw new NotFoundError('No account found with this email.');
    }

    if (user.isVerified) {
      const tokens = await this.issueTokens(
        user.id,
        user.email,
        user.role,
        user.provider,
      );
      return { user: mapUserForClient(user), tokens };
    }

    if (
      !user.emailVerifyToken ||
      isExpired(user.emailVerifyExpires) ||
      user.emailVerifyToken !== hashToken(input.code)
    ) {
      throw new BadRequestError('Invalid verification code.');
    }

    const updated = await userRepository.update(user.id, {
      isVerified: true,
      emailVerifyToken: null,
      emailVerifyExpires: null,
    });

    const tokens = await this.issueTokens(
      updated.id,
      updated.email,
      updated.role,
      updated.provider,
    );
    logger.auth('Email verified', { userId: updated.id });
    return { user: mapUserForClient(updated), tokens };
  }

  async resendVerification(email: string) {
    const user = await userRepository.findByEmail(email);
    if (user && !user.isVerified && user.email) {
      const code = generateOtp();
      await userRepository.update(user.id, {
        emailVerifyToken: hashToken(code),
        emailVerifyExpires: addMinutes(new Date(), env.EMAIL_VERIFICATION_EXPIRES_MIN),
      });
      await emailService.sendVerificationEmail(user.email, code);
      if (isDev) {
        logger.auth(`[dev] resend verify code for ${user.email}: ${code}`);
      }
    }
    return { message: 'Verification code sent.', cooldownSeconds: 60 };
  }

  /** Guest mode — ephemeral limited account */
  async guestLogin() {
    const guestId = uuidv4().slice(0, 8);
    const user = await userRepository.create({
      firstName: 'Guest',
      lastName: 'Learner',
      username: `guest_${guestId}`,
      email: null,
      provider: AuthProvider.GUEST,
      role: UserRole.GUEST,
      subscriptionTier: SubscriptionTier.FREE,
      isVerified: true,
      subscription: { create: { tier: SubscriptionTier.FREE } },
    });

    const tokens = await this.issueTokens(
      user.id,
      null,
      user.role,
      user.provider,
      undefined,
      false,
    );
    return { user: mapUserForClient(user), tokens };
  }

  /**
   * Social auth stub — accepts provider label; wire Google/Apple token verify later.
   */
  async socialLogin(provider: 'google' | 'apple', _idToken: string) {
    const email =
      provider === 'google' ? 'google.user@learnixo.app' : 'apple.user@learnixo.app';

    let user = await userRepository.findByEmail(email);
    if (!user) {
      user = await userRepository.create({
        firstName: provider === 'google' ? 'Google' : 'Apple',
        lastName: 'User',
        username: `${provider}_user_${uuidv4().slice(0, 6)}`,
        email,
        provider: provider === 'google' ? AuthProvider.GOOGLE : AuthProvider.APPLE,
        role: UserRole.STUDENT,
        subscriptionTier: SubscriptionTier.FREE,
        isVerified: true,
        subscription: { create: { tier: SubscriptionTier.FREE } },
      });
    }

    const tokens = await this.issueTokens(user.id, user.email, user.role, user.provider);
    return { user: mapUserForClient(user), tokens };
  }

  private async issueTokens(
    userId: string,
    email: string | null,
    role: UserRole,
    provider: AuthProvider,
    meta?: { userAgent?: string; ip?: string },
    persistRefresh = true,
  ) {
    const accessToken = signAccessToken({
      sub: userId,
      email,
      role,
      provider,
    });

    const jti = uuidv4();
    const refreshToken = signRefreshToken({ sub: userId, jti });
    const expiresAt = new Date(Date.now() + parseExpiryToMs(env.JWT_REFRESH_EXPIRES_IN));

    if (persistRefresh) {
      await refreshTokenRepository.create({
        token: hashToken(refreshToken),
        expiresAt,
        userAgent: meta?.userAgent,
        ipAddress: meta?.ip,
        user: { connect: { id: userId } },
      });
    }

    return {
      accessToken,
      refreshToken,
      expiresAt: expiresAt.getTime(),
    };
  }
}

export const authService = new AuthService();
