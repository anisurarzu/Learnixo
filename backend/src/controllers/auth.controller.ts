import type { Response } from 'express';
import { authService } from '../services/auth/auth.service';
import { sendSuccess, sendCreated } from '../utils/response';
import { UnauthorizedError } from '../utils/errors';
import { COOKIE_NAMES } from '../constants';
import { env, isProd } from '../config/env';
import type { AuthenticatedRequest } from '../types';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from '../validators/auth.validators';

function setRefreshCookie(res: Response, refreshToken: string) {
  res.cookie(COOKIE_NAMES.refreshToken, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: `${env.API_PREFIX}/auth`,
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(COOKIE_NAMES.refreshToken, {
    path: `${env.API_PREFIX}/auth`,
  });
}

export class AuthController {
  register = async (req: AuthenticatedRequest, res: Response) => {
    const result = await authService.register(req.body as RegisterInput);
    setRefreshCookie(res, result.tokens.refreshToken);
    return sendCreated(res, result, 'Account created. Please verify your email.');
  };

  login = async (req: AuthenticatedRequest, res: Response) => {
    const result = await authService.login(req.body as LoginInput, {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });
    setRefreshCookie(res, result.tokens.refreshToken);
    return sendSuccess(res, result, 'Logged in successfully');
  };

  logout = async (req: AuthenticatedRequest, res: Response) => {
    const bodyToken = (req.body as { refreshToken?: string })?.refreshToken;
    const cookieToken = req.cookies?.[COOKIE_NAMES.refreshToken] as string | undefined;
    await authService.logout(bodyToken ?? cookieToken, req.user?.id);
    clearRefreshCookie(res);
    return sendSuccess(res, null, 'Logged out successfully');
  };

  refresh = async (req: AuthenticatedRequest, res: Response) => {
    const bodyToken = (req.body as { refreshToken?: string })?.refreshToken;
    const cookieToken = req.cookies?.[COOKIE_NAMES.refreshToken] as string | undefined;
    const raw = bodyToken ?? cookieToken;
    if (!raw) {
      throw new UnauthorizedError('Refresh token required');
    }
    const tokens = await authService.refresh(raw);
    setRefreshCookie(res, tokens.refreshToken);
    return sendSuccess(res, { tokens }, 'Token refreshed');
  };

  me = async (req: AuthenticatedRequest, res: Response) => {
    const user = await authService.getCurrentUser(req.user!.id);
    return sendSuccess(res, { user }, 'Current user');
  };

  forgotPassword = async (req: AuthenticatedRequest, res: Response) => {
    const result = await authService.forgotPassword(req.body as ForgotPasswordInput);
    return sendSuccess(res, result, result.message);
  };

  resetPassword = async (req: AuthenticatedRequest, res: Response) => {
    const result = await authService.resetPassword(req.body as ResetPasswordInput);
    return sendSuccess(res, result, result.message);
  };

  verifyEmail = async (req: AuthenticatedRequest, res: Response) => {
    const result = await authService.verifyEmail(req.body as VerifyEmailInput);
    setRefreshCookie(res, result.tokens.refreshToken);
    return sendSuccess(res, result, 'Email verified successfully');
  };

  resendVerification = async (req: AuthenticatedRequest, res: Response) => {
    const { email } = req.body as { email: string };
    const result = await authService.resendVerification(email);
    return sendSuccess(res, result, result.message);
  };

  guest = async (_req: AuthenticatedRequest, res: Response) => {
    const result = await authService.guestLogin();
    return sendSuccess(res, result, 'Guest session created');
  };

  google = async (req: AuthenticatedRequest, res: Response) => {
    const { idToken } = req.body as { idToken: string };
    const result = await authService.socialLogin('google', idToken);
    setRefreshCookie(res, result.tokens.refreshToken);
    return sendSuccess(res, result, 'Signed in with Google');
  };

  apple = async (req: AuthenticatedRequest, res: Response) => {
    const { idToken } = req.body as { idToken: string };
    const result = await authService.socialLogin('apple', idToken);
    setRefreshCookie(res, result.tokens.refreshToken);
    return sendSuccess(res, result, 'Signed in with Apple');
  };
}

export const authController = new AuthController();
