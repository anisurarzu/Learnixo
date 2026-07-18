import { env, isDev } from '../../config/env';
import { logger } from '../../utils/logger';

/**
 * Email service stub — logs in development.
 * Swap for Nodemailer / SES / Resend without changing callers.
 */
export class EmailService {
  async sendVerificationEmail(to: string, code: string): Promise<void> {
    await this.send(
      to,
      'Verify your Learnixo email',
      `Your verification code is: ${code}`,
    );
  }

  async sendPasswordResetEmail(to: string, code: string): Promise<void> {
    await this.send(
      to,
      'Reset your Learnixo password',
      `Your password reset code is: ${code}`,
    );
  }

  private async send(to: string, subject: string, body: string): Promise<void> {
    if (isDev || !env.SMTP_HOST) {
      logger.info('[email:dev]', { to, subject, body });
      return;
    }

    // TODO: Wire SMTP / transactional email provider
    logger.info('[email:queued]', { to, subject });
  }
}

export const emailService = new EmailService();
