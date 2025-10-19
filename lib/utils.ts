/**
 * Utility Functions: Wysh Festival Greeting Platform
 *
 * Common helper functions for styling, text manipulation, and validation
 */

import { type ClassValue, clsx } from "clsx";
import DOMPurify from "dompurify";
import { twMerge } from "tailwind-merge";
import { VALIDATION_CONSTRAINTS } from "./constants";

// ============================================================================
// Styling Utilities
// ============================================================================

/**
 * Merge Tailwind CSS classes with proper precedence
 *
 * @param inputs - Class names to merge
 * @returns Merged class string
 *
 * @example
 * cn("px-4 py-2", "px-6") // "px-6 py-2"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// Text Manipulation
// ============================================================================

/**
 * Truncate text to specified length with ellipsis
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 *
 * @example
 * truncate("Hello World", 5) // "Hello..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Capitalize first letter of string
 *
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Convert string to title case
 *
 * @param text - Text to convert
 * @returns Title cased text
 *
 * @example
 * toTitleCase("hello world") // "Hello World"
 */
export function toTitleCase(text: string): string {
  return text
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

/**
 * Clean and sanitize user input
 * Removes extra whitespace and potentially dangerous characters using DOMPurify
 *
 * @param input - User input string
 * @returns Sanitized string
 */

export function sanitizeInput(input: string): string {
  // Remove extra whitespace, then sanitize with DOMPurify and strip all HTML
  const trimmed = input.trim().replace(/\s+/g, " ");
  // DOMPurify.sanitize returns a string with HTML tags removed if ALLOWED_TAGS is empty
  return DOMPurify.sanitize(trimmed, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validate recipient name
 *
 * @param name - Name to validate
 * @returns Validation result with error message
 */
export function validateRecipientName(name: string): {
  valid: boolean;
  error?: string;
} {
  const sanitized = sanitizeInput(name);

  if (
    !sanitized ||
    sanitized.length < VALIDATION_CONSTRAINTS.RECIPIENT_NAME_MIN
  ) {
    return { valid: false, error: "Recipient name is required" };
  }

  if (sanitized.length > VALIDATION_CONSTRAINTS.RECIPIENT_NAME_MAX) {
    return {
      valid: false,
      error: `Name must be ${VALIDATION_CONSTRAINTS.RECIPIENT_NAME_MAX} characters or less`,
    };
  }

  return { valid: true };
}

/**
 * Validate sender name
 *
 * @param name - Name to validate
 * @returns Validation result with error message
 */
export function validateSenderName(name: string): {
  valid: boolean;
  error?: string;
} {
  const sanitized = sanitizeInput(name);

  if (!sanitized || sanitized.length < VALIDATION_CONSTRAINTS.SENDER_NAME_MIN) {
    return { valid: false, error: "Sender name is required" };
  }

  if (sanitized.length > VALIDATION_CONSTRAINTS.SENDER_NAME_MAX) {
    return {
      valid: false,
      error: `Name must be ${VALIDATION_CONSTRAINTS.SENDER_NAME_MAX} characters or less`,
    };
  }

  return { valid: true };
}

/**
 * Validate custom message
 *
 * @param message - Message to validate
 * @returns Validation result with error message
 */
export function validateCustomMessage(message: string): {
  valid: boolean;
  error?: string;
} {
  const sanitized = sanitizeInput(message);

  if (sanitized.length > VALIDATION_CONSTRAINTS.CUSTOM_MESSAGE_MAX) {
    return {
      valid: false,
      error: `Message must be ${VALIDATION_CONSTRAINTS.CUSTOM_MESSAGE_MAX} characters or less`,
    };
  }

  return { valid: true };
}

// ============================================================================
// Character Counting
// ============================================================================

/**
 * Get remaining characters for input field
 *
 * @param text - Current text
 * @param maxLength - Maximum length
 * @returns Object with count and percentage
 */
export function getRemainingCharacters(
  text: string,
  maxLength: number,
): {
  remaining: number;
  used: number;
  percentage: number;
} {
  const used = text.length;
  const remaining = maxLength - used;
  const percentage = (used / maxLength) * 100;

  return { remaining, used, percentage };
}

/**
 * Check if text is approaching character limit
 *
 * @param text - Current text
 * @param maxLength - Maximum length
 * @param threshold - Warning threshold (default 90%)
 * @returns True if approaching limit
 */
export function isApproachingLimit(
  text: string,
  maxLength: number,
  threshold = 0.9,
): boolean {
  return text.length >= maxLength * threshold;
}

// ============================================================================
// URL Helpers
// ============================================================================

/**
 * Build greeting URL from shareable ID
 *
 * @param shareableId - The shareable ID
 * @returns Full greeting URL
 *
 * @example
 * buildGreetingUrl("a7x9k2m1") // "https://wysh.zealer.in/g/a7x9k2m1"
 */
export function buildGreetingUrl(shareableId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://wysh.zealer.in";
  return `${baseUrl}/g/${shareableId}`;
}

/**
 * Extract shareable ID from greeting URL
 *
 * @param url - The greeting URL
 * @returns Shareable ID or null if invalid
 */
export function extractShareableId(url: string): string | null {
  const match = url.match(/\/g\/([a-z0-9]{8})$/i);
  return match ? match[1] : null;
}

// ============================================================================
// Date Formatting
// ============================================================================

/**
 * Format timestamp to human-readable date
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Get relative time string (e.g., "2 days ago")
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Relative time string
 */
export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "just now";
}

// ============================================================================
// Error Handling
// ============================================================================

/**
 * Safely get error message from unknown error type
 *
 * @param error - Error object or message
 * @returns Error message string
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unknown error occurred";
}

/**
 * Check if error is a network error
 *
 * @param error - Error object
 * @returns True if network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes("fetch") ||
      error.message.includes("network") ||
      error.message.includes("NetworkError")
    );
  }
  return false;
}

// ============================================================================
// Retry Logic
// ============================================================================

/**
 * Retry a function with exponential backoff
 *
 * @param fn - Function to retry
 * @param maxAttempts - Maximum retry attempts
 * @param delays - Array of delay durations in ms
 * @returns Promise with function result
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delays = [0, 500, 1500],
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxAttempts - 1) {
        const delay = delays[attempt] || delays[delays.length - 1];
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Retry failed with unknown error");
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if value is defined (not null or undefined)
 *
 * @param value - Value to check
 * @returns True if defined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Check if string is empty or whitespace only
 *
 * @param value - String to check
 * @returns True if empty
 */
export function isEmpty(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

export function generateUniqueKey(prefix = "key") {
  const randomPart = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now().toString(36);
  return `${prefix}-${timestamp}-${randomPart}`;
}
