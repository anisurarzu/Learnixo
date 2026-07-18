import { env } from '../../config/env';
import { logger } from '../../utils/logger';

/**
 * Optional Redis cache layer — no-op when REDIS_ENABLED=false.
 * Ready for ioredis wiring without changing call sites.
 */
export class CacheService {
  private memory = new Map<string, { value: string; expiresAt: number }>();

  get enabled() {
    return Boolean(env.REDIS_ENABLED);
  }

  async get(key: string): Promise<string | null> {
    if (!this.enabled) {
      const hit = this.memory.get(key);
      if (!hit) return null;
      if (hit.expiresAt < Date.now()) {
        this.memory.delete(key);
        return null;
      }
      return hit.value;
    }

    // TODO: ioredis GET
    logger.debug('redis.get stub', { key });
    return null;
  }

  async set(key: string, value: string, ttlSeconds = 300): Promise<void> {
    if (!this.enabled) {
      this.memory.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
      return;
    }
    logger.debug('redis.set stub', { key, ttlSeconds });
  }

  async del(key: string): Promise<void> {
    this.memory.delete(key);
    if (this.enabled) {
      logger.debug('redis.del stub', { key });
    }
  }
}

export const cacheService = new CacheService();
