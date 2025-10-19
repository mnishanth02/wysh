// Rate Limiter Configuration
// Purpose: Define rate limiting policies for greeting creation and viewing

import { HOUR, MINUTE, RateLimiter } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

// Day constant (not exported by package)
const DAY = 24 * HOUR;

// Environment variable defaults
const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  return value ? Number.parseInt(value, 10) : defaultValue;
};

// Rate limit policies configuration
const POLICIES = {
  // Greeting creation limits (strict to prevent abuse)
  createGreetingPerMin: {
    kind: "fixed window" as const,
    rate: getEnvNumber("RATE_LIMIT_CREATE_PER_MIN", 3),
    period: MINUTE,
  },

  createGreetingPerHr: {
    kind: "fixed window" as const,
    rate: getEnvNumber("RATE_LIMIT_CREATE_PER_HR", 20),
    period: HOUR,
  },

  createGreetingPerDay: {
    kind: "fixed window" as const,
    rate: getEnvNumber("RATE_LIMIT_CREATE_PER_DAY", 50),
    period: DAY,
  },

  // Greeting viewing limits (lenient, prevents scraping)
  viewGreeting: {
    kind: "fixed window" as const,
    rate: getEnvNumber("RATE_LIMIT_VIEW_PER_MIN", 100),
    period: MINUTE,
  },
};

// Initialize rate limiter with policies
export const rateLimiter = new RateLimiter(components.rateLimiter, POLICIES);

// Export policy names for type safety
export const RATE_LIMIT_POLICIES = {
  CREATE_PER_MIN: "createGreetingPerMin",
  CREATE_PER_HR: "createGreetingPerHr",
  CREATE_PER_DAY: "createGreetingPerDay",
  VIEW: "viewGreeting",
} as const;
