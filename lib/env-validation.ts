/**
 * Environment Variable Validation
 * Validates required environment variables at build/runtime
 */

interface EnvConfig {
  // Convex
  CONVEX_DEPLOYMENT?: string;
  NEXT_PUBLIC_CONVEX_URL?: string;

  // Site
  NEXT_PUBLIC_SITE_URL?: string;

  // SEO
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?: string;

  // Node environment
  NODE_ENV: string;
}

/**
 * Validates required environment variables
 * Throws error if critical variables are missing
 */
export function validateEnv(): EnvConfig {
  const env: EnvConfig = {
    CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    NODE_ENV: process.env.NODE_ENV || "development",
  };

  // Required in production
  if (env.NODE_ENV === "production") {
    const required: (keyof EnvConfig)[] = [
      "NEXT_PUBLIC_CONVEX_URL",
      "NEXT_PUBLIC_SITE_URL",
    ];

    const missing = required.filter((key) => !env[key]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables in production: ${missing.join(", ")}`,
      );
    }

    // Validate URL format
    if (env.NEXT_PUBLIC_SITE_URL) {
      try {
        new URL(env.NEXT_PUBLIC_SITE_URL);
      } catch {
        throw new Error(
          `Invalid NEXT_PUBLIC_SITE_URL: ${env.NEXT_PUBLIC_SITE_URL}`,
        );
      }
    }

    if (env.NEXT_PUBLIC_CONVEX_URL) {
      try {
        new URL(env.NEXT_PUBLIC_CONVEX_URL);
      } catch {
        throw new Error(
          `Invalid NEXT_PUBLIC_CONVEX_URL: ${env.NEXT_PUBLIC_CONVEX_URL}`,
        );
      }
    }
  }

  return env;
}

/**
 * Get validated environment config
 * Safe to use throughout the application
 */
export function getEnv(): EnvConfig {
  return validateEnv();
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Get site URL with fallback
 */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://wysh.zealer.in";
}

/**
 * Get Convex URL with fallback
 */
export function getConvexUrl(): string {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    if (isProduction()) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL is required in production");
    }
    return ""; // Development fallback
  }
  return process.env.NEXT_PUBLIC_CONVEX_URL;
}
