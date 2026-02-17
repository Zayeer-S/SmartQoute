import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import { backEnv } from '../config/env.backend.js';
import { authRateLimitConfig } from '../config/auth-config.js';

/**
 * Rate Limit Middleware
 * Uses Redis for distributed rate limiting across multiple server instances
 */
const redisClient = createClient({
  socket: {
    host: backEnv.REDIS_HOST,
    port: backEnv.REDIS_PORT,
  },
  password: backEnv.REDIS_PASSWORD,
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error for rate limiting:', err);
});

void (async () => {
  try {
    await redisClient.connect();
    console.log('Redis client connected for rate limiting');
  } catch (err) {
    console.error('Failed to connect to Redis for rate limiting:', err);
  }
})();

/**
 * Login Rate Limiter
 * Prevents brute force attacks on login endpoint
 */
export const loginRateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    prefix: 'rate_limit:login:',
  }),
  windowMs: authRateLimitConfig.login.windowMs,
  max: authRateLimitConfig.login.maxAttempts,
  message: {
    success: false,
    data: null,
    error: 'Too many login attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

export const apiRateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    prefix: 'rate_limit:login:',
  }),
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    data: null,
    error: 'Too many requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export { redisClient };
