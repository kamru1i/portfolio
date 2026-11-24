import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const CONTACT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_CONTACT_REQUESTS = 5;

const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_LOGIN_FAILURES = 8;

const MAX_IN_MEMORY_KEYS = 500;

const contactFallbackMap = new Map<string, number[]>();
const loginFallbackMap = new Map<string, number[]>();

type RateLimiters = {
  contactLimiter: Ratelimit;
  loginLimiter: Ratelimit;
};

let cachedLimiters: RateLimiters | null = null;
let cachedEnvSignature: string | null = null;

export function isUpstashRateLimitConfigured(): boolean {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  return Boolean(url && token);
}

function getUpstashLimiters(): RateLimiters | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    return null;
  }

  const signature = `${url}|${token}`;
  if (cachedLimiters && cachedEnvSignature === signature) {
    return cachedLimiters;
  }

  const redis = new Redis({ url, token });
  cachedLimiters = {
    contactLimiter: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(MAX_CONTACT_REQUESTS, "10 m"),
      prefix: "rl:portfolio:contact",
    }),
    loginLimiter: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(MAX_LOGIN_FAILURES, "15 m"),
      prefix: "rl:portfolio:admin-login",
      ephemeralCache: false,
    }),
  };
  cachedEnvSignature = signature;
  return cachedLimiters;
}

function pruneMapIfNeeded(map: Map<string, number[]>, windowMs: number): void {
  if (map.size <= MAX_IN_MEMORY_KEYS) return;
  const now = Date.now();
  for (const [key, timestamps] of map.entries()) {
    const recent = timestamps.filter((t) => now - t < windowMs);
    if (recent.length === 0) {
      map.delete(key);
    } else {
      map.set(key, recent);
    }
  }
}

function checkInMemoryContactLimit(ip: string): boolean {
  const now = Date.now();
  pruneMapIfNeeded(contactFallbackMap, CONTACT_WINDOW_MS);

  const existing = contactFallbackMap.get(ip) || [];
  const recent = existing.filter((t) => now - t < CONTACT_WINDOW_MS);
  if (recent.length >= MAX_CONTACT_REQUESTS) {
    contactFallbackMap.set(ip, recent);
    return true;
  }
  recent.push(now);
  contactFallbackMap.set(ip, recent);
  return false;
}

function checkInMemoryLoginLimit(ip: string): boolean {
  const now = Date.now();
  const existing = loginFallbackMap.get(ip);
  if (!existing || existing.length === 0) return false;
  const recent = existing.filter((t) => now - t < LOGIN_WINDOW_MS);
  if (recent.length === 0) {
    loginFallbackMap.delete(ip);
    return false;
  }
  loginFallbackMap.set(ip, recent);
  return recent.length >= MAX_LOGIN_FAILURES;
}

function recordInMemoryLoginFailure(ip: string): void {
  const now = Date.now();
  pruneMapIfNeeded(loginFallbackMap, LOGIN_WINDOW_MS);
  const existing = loginFallbackMap.get(ip) || [];
  const recent = existing.filter((t) => now - t < LOGIN_WINDOW_MS);
  recent.push(now);
  loginFallbackMap.set(ip, recent);
}

/**
 * Checks whether a contact-form submission IP has exceeded 5 requests / 10 minutes.
 * Uses distributed Upstash Redis when configured, falling back to an in-memory map.
 */
export async function checkContactRateLimit(ip: string): Promise<boolean> {
  const limiters = getUpstashLimiters();
  if (limiters) {
    try {
      const { success } = await limiters.contactLimiter.limit(ip);
      return !success;
    } catch {
      return checkInMemoryContactLimit(ip);
    }
  }
  return checkInMemoryContactLimit(ip);
}

/**
 * Checks whether an admin sign-in IP is currently throttled (8 failures / 15 minutes).
 */
export async function isLoginRateLimited(ip: string): Promise<boolean> {
  const limiters = getUpstashLimiters();
  if (limiters) {
    try {
      const { remaining } = await limiters.loginLimiter.getRemaining(ip);
      return remaining <= 0;
    } catch {
      return checkInMemoryLoginLimit(ip);
    }
  }
  return checkInMemoryLoginLimit(ip);
}

/**
 * Records a failed admin authentication attempt for an IP.
 */
export async function recordFailedLoginAttempt(ip: string): Promise<void> {
  const limiters = getUpstashLimiters();
  if (limiters) {
    try {
      await limiters.loginLimiter.limit(ip);
      return;
    } catch {
      recordInMemoryLoginFailure(ip);
      return;
    }
  }
  recordInMemoryLoginFailure(ip);
}

/**
 * Clears failure counter for an IP after a verified admin login.
 */
export async function clearFailedLoginAttempts(ip: string): Promise<void> {
  loginFallbackMap.delete(ip);
  const limiters = getUpstashLimiters();
  if (limiters) {
    try {
      await limiters.loginLimiter.resetUsedTokens(ip);
    } catch {
      // Non-fatal if Upstash reset fails
    }
  }
}

export function __resetInMemoryRateLimitersForTest(): void {
  contactFallbackMap.clear();
  loginFallbackMap.clear();
}
