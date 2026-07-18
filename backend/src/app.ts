import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { env, isDev } from './config/env';
import { corsOptions } from './config/cors';
import { swaggerSpec } from './config/swagger';
import {
  errorHandler,
  notFoundHandler,
  globalRateLimiter,
  requestId,
  requestLogger,
} from './middlewares';
import routes from './routes';
import { logger } from './utils/logger';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors(corsOptions));
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(requestId);
  app.use(requestLogger);
  app.use(globalRateLimiter);

  if (isDev) {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  // Local uploads (Cloudinary preferred in production)
  app.use('/uploads', express.static(path.resolve(process.cwd(), env.UPLOAD_DIR)));

  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: `${env.APP_NAME} is running`,
      data: {
        version: '1.0.0',
        docs: '/api/docs',
        health: `${env.API_PREFIX}/health`,
      },
      errors: null,
    });
  });

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
  app.get('/api/docs.json', (_req, res) => res.json(swaggerSpec));

  app.use(env.API_PREFIX, routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  logger.info('Express app configured', { prefix: env.API_PREFIX });

  return app;
}
