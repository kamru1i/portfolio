import { beforeEach, describe, expect, it } from "vitest";
import {
  __resetInMemoryRateLimitersForTest,
  checkContactRateLimit,
  clearFailedLoginAttempts,
  isLoginRateLimited,
  isUpstashRateLimitConfigured,
  recordFailedLoginAttempt,
} from "./rate-limit";

describe("rate-limit (in-memory fallback)", () => {
  beforeEach(() => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    __resetInMemoryRateLimitersForTest();
  });

  it("reports unconfigured when Upstash env variables are absent", () => {
    expect(isUpstashRateLimitConfigured()).toBe(false);
  });

  it("allows 5 contact submissions per window and blocks the 6th", async () => {
    const ip = "203.0.113.10";
    for (let i = 0; i < 5; i++) {
      expect(await checkContactRateLimit(ip)).toBe(false);
    }
    expect(await checkContactRateLimit(ip)).toBe(true);
    // Independent IP stays unaffected
    expect(await checkContactRateLimit("203.0.113.11")).toBe(false);
  });

  it("throttles admin login after 8 failed attempts and resets on clear", async () => {
    const ip = "198.51.100.7";
    expect(await isLoginRateLimited(ip)).toBe(false);

    for (let i = 0; i < 7; i++) {
      await recordFailedLoginAttempt(ip);
      expect(await isLoginRateLimited(ip)).toBe(false);
    }

    await recordFailedLoginAttempt(ip);
    expect(await isLoginRateLimited(ip)).toBe(true);

    await clearFailedLoginAttempts(ip);
    expect(await isLoginRateLimited(ip)).toBe(false);
  });
});
