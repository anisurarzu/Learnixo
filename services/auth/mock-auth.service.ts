/**
 * In-memory mock auth backend with realistic latency.
 * Swap this module's usage for a real API later with minimal changes.
 */

import {
  AuthError,
  type AuthProvider,
  type AuthResponse,
  type AuthTokens,
  type ForgotPasswordPayload,
  type LoginCredentials,
  type RegisterCredentials,
  type ResetPasswordPayload,
  type User,
  type UserRole,
  type VerifyEmailPayload,
} from '@/types';

const DELAY_MS = { min: 600, max: 1200 } as const;

type MockAccount = {
  password: string;
  user: User;
  verifiedCode: string;
  resetCode: string;
};

const accounts = new Map<string, MockAccount>();
const usernames = new Set<string>();
const refreshToEmail = new Map<string, string>();
const accessToEmail = new Map<string, string>();
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function delay(ms = randomDelay()) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay() {
  return DELAY_MS.min + Math.floor(Math.random() * (DELAY_MS.max - DELAY_MS.min));
}

function nowIso() {
  return new Date().toISOString();
}

function id() {
  return `usr_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function token(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function otp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function createTokens(email: string): AuthTokens {
  const accessToken = token('atk');
  const refreshToken = token('rtk');
  accessToEmail.set(accessToken, email);
  refreshToEmail.set(refreshToken, email);
  return {
    accessToken,
    refreshToken,
    expiresAt: Date.now() + 60 * 60 * 1000,
  };
}

function assertRateLimit(key: string) {
  const entry = rateLimit.get(key);
  const now = Date.now();
  if (!entry || entry.resetAt < now) {
    rateLimit.set(key, { count: 1, resetAt: now + 60_000 });
    return;
  }
  entry.count += 1;
  if (entry.count > 8) {
    throw new AuthError(
      'TOO_MANY_REQUESTS',
      'Too many attempts. Please wait a moment.',
      429,
    );
  }
}

function createUser(partial: {
  firstName: string;
  lastName: string;
  username: string;
  email: string | null;
  provider: AuthProvider;
  isVerified?: boolean;
  role?: UserRole;
}): User {
  const ts = nowIso();
  return {
    id: id(),
    firstName: partial.firstName,
    lastName: partial.lastName,
    username: partial.username,
    email: partial.email,
    photo: null,
    provider: partial.provider,
    isVerified: partial.isVerified ?? partial.provider !== 'email',
    role: partial.role ?? (partial.provider === 'guest' ? 'guest' : 'student'),
    subscription: 'free',
    createdAt: ts,
    updatedAt: ts,
  };
}

// Seed demo account for easy testing
(() => {
  const email = 'demo@learnixo.app';
  const user = createUser({
    firstName: 'Alex',
    lastName: 'Student',
    username: 'alex_student',
    email,
    provider: 'email',
    isVerified: true,
  });
  accounts.set(email, {
    password: 'Demo@1234',
    user,
    verifiedCode: '123456',
    resetCode: '654321',
  });
  usernames.add(user.username.toLowerCase());
})();

export const mockAuthBackend = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay();
    assertRateLimit(`login:${credentials.email.toLowerCase()}`);

    const email = credentials.email.trim().toLowerCase();
    const account = accounts.get(email);
    if (!account || account.password !== credentials.password) {
      throw new AuthError('INVALID_CREDENTIALS', 'Incorrect email or password.', 401);
    }

    const tokens = createTokens(email);
    return { user: account.user, tokens };
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    await delay();
    const email = credentials.email.trim().toLowerCase();
    const username = credentials.username.trim().toLowerCase();

    if (accounts.has(email)) {
      throw new AuthError(
        'EMAIL_EXISTS',
        'An account with this email already exists.',
        409,
      );
    }
    if (usernames.has(username)) {
      throw new AuthError('USERNAME_EXISTS', 'This username is already taken.', 409);
    }

    const user = createUser({
      firstName: credentials.firstName.trim(),
      lastName: credentials.lastName.trim(),
      username: credentials.username.trim(),
      email,
      provider: 'email',
      isVerified: false,
    });

    const code = otp();
    accounts.set(email, {
      password: credentials.password,
      user,
      verifiedCode: code,
      resetCode: otp(),
    });
    usernames.add(username);

    // In production: send verification email. Log for mock debugging.
    if (__DEV__) {
      console.info(`[mock-auth] verify code for ${email}: ${code}`);
    }

    const tokens = createTokens(email);
    return { user, tokens };
  },

  async socialLogin(provider: 'google' | 'apple'): Promise<AuthResponse> {
    await delay();
    const email =
      provider === 'google' ? 'google.user@learnixo.app' : 'apple.user@learnixo.app';
    let account = accounts.get(email);
    if (!account) {
      const user = createUser({
        firstName: provider === 'google' ? 'Google' : 'Apple',
        lastName: 'User',
        username: `${provider}_user`,
        email,
        provider,
        isVerified: true,
      });
      account = {
        password: '',
        user,
        verifiedCode: '000000',
        resetCode: '000000',
      };
      accounts.set(email, account);
      usernames.add(user.username.toLowerCase());
    }
    return { user: account.user, tokens: createTokens(email) };
  },

  async guestLogin(): Promise<AuthResponse> {
    await delay(400);
    const guestId = id();
    const user = createUser({
      firstName: 'Guest',
      lastName: 'Learner',
      username: `guest_${guestId.slice(-6)}`,
      email: null,
      provider: 'guest',
      isVerified: true,
      role: 'guest',
    });
    const tokens = createTokens(`guest:${user.id}`);
    return { user, tokens };
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
    await delay();
    const email = payload.email.trim().toLowerCase();
    assertRateLimit(`forgot:${email}`);
    const account = accounts.get(email);
    if (!account) {
      // Don't leak existence — still return success
      return { message: 'If an account exists, a reset code was sent.' };
    }
    account.resetCode = otp();
    if (__DEV__) {
      console.info(`[mock-auth] reset code for ${email}: ${account.resetCode}`);
    }
    return { message: 'If an account exists, a reset code was sent.' };
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
    await delay();
    const email = payload.email.trim().toLowerCase();
    const account = accounts.get(email);
    if (!account) {
      throw new AuthError('USER_NOT_FOUND', 'No account found with this email.', 404);
    }
    if (account.resetCode !== payload.otp) {
      throw new AuthError('VALIDATION_ERROR', 'Invalid or expired reset code.', 400);
    }
    account.password = payload.password;
    account.resetCode = otp();
    return { message: 'Password updated successfully.' };
  },

  async verifyEmail(payload: VerifyEmailPayload): Promise<AuthResponse> {
    await delay();
    const email = payload.email.trim().toLowerCase();
    const account = accounts.get(email);
    if (!account) {
      throw new AuthError('USER_NOT_FOUND', 'No account found with this email.', 404);
    }
    if (account.verifiedCode !== payload.code) {
      throw new AuthError('VALIDATION_ERROR', 'Invalid verification code.', 400);
    }
    account.user = {
      ...account.user,
      isVerified: true,
      updatedAt: nowIso(),
    };
    return { user: account.user, tokens: createTokens(email) };
  },

  async resendVerification(
    emailRaw: string,
  ): Promise<{ message: string; cooldownSeconds: number }> {
    await delay(500);
    const email = emailRaw.trim().toLowerCase();
    assertRateLimit(`verify:${email}`);
    const account = accounts.get(email);
    if (account && !account.user.isVerified) {
      account.verifiedCode = otp();
      if (__DEV__) {
        console.info(
          `[mock-auth] resend verify code for ${email}: ${account.verifiedCode}`,
        );
      }
    }
    return { message: 'Verification code sent.', cooldownSeconds: 60 };
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    await delay(300);
    const email = refreshToEmail.get(refreshToken);
    if (!email) {
      throw new AuthError('TOKEN_EXPIRED', 'Refresh token is invalid or expired.', 401);
    }
    refreshToEmail.delete(refreshToken);
    return createTokens(email);
  },

  async getCurrentUser(accessToken: string): Promise<User> {
    await delay(350);
    const email = accessToEmail.get(accessToken);
    if (!email || !accessToken.startsWith('atk_')) {
      throw new AuthError('UNAUTHORIZED', 'Invalid access token.', 401);
    }
    if (email.startsWith('guest:')) {
      throw new AuthError('UNAUTHORIZED', 'Guest session — use in-memory profile.', 401);
    }
    const account = accounts.get(email);
    if (!account) {
      throw new AuthError('UNAUTHORIZED', 'Session not found.', 401);
    }
    return account.user;
  },

  async logout(_refreshToken?: string): Promise<void> {
    await delay(250);
    if (_refreshToken) {
      refreshToEmail.delete(_refreshToken);
    }
  },

  /** Test helper — expose seeded credentials */
  getDemoCredentials() {
    return { email: 'demo@learnixo.app', password: 'Demo@1234' };
  },
};
