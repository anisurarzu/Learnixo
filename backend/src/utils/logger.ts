import fs from 'fs';
import path from 'path';
import { isDev } from '../config/env';

type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'auth' | 'upload';

const LOG_DIR = path.resolve(process.cwd(), 'src/logs');

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function writeFile(level: LogLevel, line: string) {
  try {
    ensureLogDir();
    const file = path.join(LOG_DIR, `${level === 'error' ? 'error' : 'app'}.log`);
    fs.appendFileSync(file, line + '\n');
  } catch {
    // never crash on logging
  }
}

function format(level: LogLevel, message: string, meta?: unknown): string {
  const payload = meta === undefined ? '' : ` ${JSON.stringify(meta)}`;
  return `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}${payload}`;
}

export const logger = {
  info(message: string, meta?: unknown) {
    const line = format('info', message, meta);
    console.info(line);
    if (!isDev) writeFile('info', line);
  },
  warn(message: string, meta?: unknown) {
    const line = format('warn', message, meta);
    console.warn(line);
    writeFile('warn', line);
  },
  error(message: string, meta?: unknown) {
    const line = format('error', message, meta);
    console.error(line);
    writeFile('error', line);
  },
  debug(message: string, meta?: unknown) {
    if (!isDev) return;
    console.debug(format('debug', message, meta));
  },
  auth(message: string, meta?: unknown) {
    const line = format('auth', message, meta);
    console.info(line);
    writeFile('auth', line);
  },
  upload(message: string, meta?: unknown) {
    const line = format('upload', message, meta);
    console.info(line);
    writeFile('upload', line);
  },
};
