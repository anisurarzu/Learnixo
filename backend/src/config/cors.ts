import { env } from './env';

export const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    const allowed = [
      env.CLIENT_URL,
      'http://localhost:8081',
      'http://localhost:19006',
      'exp://localhost:8081',
    ];

    // Mobile apps / Expo often omit Origin
    if (!origin || allowed.some((o) => origin.startsWith(o)) || !isStrictOrigin()) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
};

function isStrictOrigin() {
  return env.NODE_ENV === 'production';
}
