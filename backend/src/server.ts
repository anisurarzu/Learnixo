import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './database';
import { logger } from './utils/logger';

async function bootstrap() {
  await connectDatabase();
  logger.info('Database connected');

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`${env.APP_NAME} listening on port ${env.PORT}`, {
      env: env.NODE_ENV,
      docs: `${env.APP_URL}/api/docs`,
    });
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled rejection', { reason: String(reason) });
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', { message: error.message, stack: error.stack });
    process.exit(1);
  });
}

void bootstrap();
