/**
 * Input Sanitization Utilities
 * Prevents XSS attacks by sanitizing user inputs
 */

import DOMPurify from "dompurify";

/**
 * Sanitize text input to prevent XSS attacks
 * Strips all HTML tags and dangerous characters
 *
 * @param input - Raw user input string
 * @returns Sanitized string safe for display
 */
export function sanitizeText(input: string): string {
  if (!input) return "";

  // Configure DOMPurify to strip all HTML tags
  const clean = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true, // Keep text content
  });

  // Additional cleaning: remove potential script injection attempts
  return clean
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}

/**
 * Sanitize name input (recipient/sender names)
 * Allows alphanumeric, spaces, and common name characters
 *
 * @param name - Raw name input
 * @param maxLength - Maximum allowed length (default: 50)
 * @returns Sanitized name
 */
export function sanitizeName(name: string, maxLength = 50): string {
  if (!name) return "";

  // First, sanitize with DOMPurify
  let clean = sanitizeText(name);

  // Allow only letters, numbers, spaces, hyphens, apostrophes, and dots
  clean = clean.replace(/[^a-zA-Z0-9\s\-'.&]/g, "");

  // Collapse multiple spaces
  clean = clean.replace(/\s+/g, " ");

  // Trim and enforce max length
  return clean.trim().substring(0, maxLength);
}

/**
 * Sanitize custom message input
 * Allows text, emojis, and common punctuation, but strips HTML
 *
 * @param message - Raw message input
 * @param maxLength - Maximum allowed length (default: 500)
 * @returns Sanitized message
 */
export function sanitizeMessage(message: string, maxLength = 500): string {
  if (!message) return "";

  // Sanitize with DOMPurify
  let clean = sanitizeText(message);

  // Allow text, numbers, common punctuation, and emojis
  // This pattern preserves:
  // - Alphanumeric characters and common punctuation: .,!?;:'"()-—
  // - Unicode letters (\p{L}) and numbers (\p{N})
  // - Emojis through a broader range using character codes
  // - Spaces and line breaks

  // First pass: remove obviously dangerous characters but preserve emojis
  // Unicode emoji ranges:
  // - U+1F300-U+1F9FF (Miscellaneous Symbols, Emoticons, etc.)
  // - U+2600-U+27BF (Miscellaneous Symbols)
  // - U+2300-U+23FF (Miscellaneous Technical)
  // - U+1F900-U+1F9FF (Supplemental Symbols)
  clean = clean.replace(/[^\w\s.,!?;:'"()\-—\u0080-\uFFFF]/g, "");

  // Collapse multiple spaces
  clean = clean.replace(/\s+/g, " ");

  // Trim and enforce max length
  return clean.trim().substring(0, maxLength);
}

/**
 * Validate and sanitize all greeting inputs
 *
 * @param inputs - Raw greeting inputs
 * @returns Sanitized and validated inputs
 * @throws Error if validation fails
 */
export function sanitizeGreetingInputs(inputs: {
  recipientName: string;
  senderName: string;
  customMessage?: string;
}): {
  recipientName: string;
  senderName: string;
  customMessage?: string;
} {
  const recipientName = sanitizeName(inputs.recipientName);
  const senderName = sanitizeName(inputs.senderName);
  const customMessage = inputs.customMessage
    ? sanitizeMessage(inputs.customMessage)
    : undefined;

  // Validation after sanitization
  if (!recipientName || recipientName.length < 1) {
    throw new Error(
      "Recipient name is required and must be at least 1 character",
    );
  }

  if (!senderName || senderName.length < 1) {
    throw new Error("Sender name is required and must be at least 1 character");
  }

  if (recipientName.length > 50) {
    throw new Error("Recipient name must be 50 characters or less");
  }

  if (senderName.length > 50) {
    throw new Error("Sender name must be 50 characters or less");
  }

  if (customMessage && customMessage.length > 500) {
    throw new Error("Custom message must be 500 characters or less");
  }

  return {
    recipientName,
    senderName,
    customMessage,
  };
}
