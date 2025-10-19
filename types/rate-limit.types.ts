// Rate Limit Types
// Purpose: TypeScript types for rate limiting functionality

export interface RateLimitStatus {
  ok: boolean;
  retryAfter: number; // milliseconds until next request allowed
  limit: number; // maximum requests allowed
  remaining: number; // requests remaining in current window
  reset: number; // timestamp when limit resets
}

export interface RateLimitConfig {
  key: string; // identifier (usually IP address)
  endpoint: string; // which endpoint/operation being limited
  rate: number; // maximum requests
  period: number; // time window in milliseconds
}

export interface RateLimitViolation {
  timestamp: number;
  ip: string;
  endpoint: string;
  violationType: "RATE_LIMIT_EXCEEDED";
  retryAfter: number;
}

export type RateLimitPolicy = {
  kind: "fixed window" | "token bucket";
  rate: number; // requests per period
  period: number; // milliseconds
  capacity?: number; // for token bucket only
  shards?: number; // for high-throughput (default: 1)
};
