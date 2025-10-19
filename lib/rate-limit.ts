// Rate Limit Utilities
// Purpose: IP extraction and whitelist checking for rate limiting

/**
 * Extract real IP address from request headers
 * Checks common proxy headers in order of preference:
 * 1. x-forwarded-for (most common)
 * 2. x-real-ip (nginx)
 * 3. cf-connecting-ip (Cloudflare)
 */
export function extractIpAddress(headers: Headers): string {
  // Try x-forwarded-for first (comma-separated list, first IP is client)
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ips = forwardedFor.split(",").map((ip) => ip.trim());
    return ips[0] || "unknown";
  }

  // Try x-real-ip (nginx)
  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  // Try cf-connecting-ip (Cloudflare)
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  // Fallback for development/testing
  return "unknown";
}

/**
 * Check if IP is whitelisted (bypasses rate limits)
 * Whitelist loaded from RATE_LIMIT_WHITELIST_IPS env var
 */
export function isWhitelisted(ip: string): boolean {
  const whitelist = process.env.RATE_LIMIT_WHITELIST_IPS || "";

  if (!whitelist || whitelist.trim() === "") {
    return false;
  }

  const whitelistedIps = whitelist
    .split(",")
    .map((ip) => ip.trim())
    .filter((ip) => ip !== "");

  return whitelistedIps.includes(ip);
}

/**
 * Get rate limit configuration from environment variables with fallback defaults
 */
export function getRateLimitConfig() {
  return {
    createPerMin: Number.parseInt(
      process.env.RATE_LIMIT_CREATE_PER_MIN || "3",
      10,
    ),
    createPerHr: Number.parseInt(
      process.env.RATE_LIMIT_CREATE_PER_HR || "20",
      10,
    ),
    createPerDay: Number.parseInt(
      process.env.RATE_LIMIT_CREATE_PER_DAY || "50",
      10,
    ),
    viewPerMin: Number.parseInt(
      process.env.RATE_LIMIT_VIEW_PER_MIN || "100",
      10,
    ),
  };
}
