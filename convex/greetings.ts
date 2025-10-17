/**
 * Convex Greetings Functions: Wysh Festival Greeting Platform
 *
 * Mutations and queries for creating and viewing festival greetings
 */

import { v } from "convex/values";
import { generateShareableId } from "../lib/id-generator";
import { mutation, query } from "./_generated/server";

// ============================================================================
// Validation Constants
// ============================================================================

const VALID_FESTIVAL_TYPES = [
  "diwali",
  "holi",
  "christmas",
  "newyear",
  "pongal",
  "generic",
] as const;

const VALID_RELATIONSHIP_TYPES = [
  "parents",
  "siblings",
  "spouse",
  "children",
  "relatives",
  "friend",
  "best_friend",
  "neighbor",
  "boss",
  "colleague",
  "client",
  "mentor",
  "partner",
  "fiance",
  "crush",
] as const;

const VALID_TEMPLATE_IDS = [
  "diwali-1",
  "diwali-2",
  "diwali-3",
  "holi-1",
  "holi-2",
  "holi-3",
  "christmas-1",
  "christmas-2",
  "christmas-3",
  "newyear-1",
  "newyear-2",
  "newyear-3",
  "pongal-1",
  "pongal-2",
  "pongal-3",
  "generic-1",
  "generic-2",
] as const;

// Regex to detect HTML tags and script content (XSS prevention)
const HTML_TAG_REGEX = /<[^>]*>|<script|javascript:/gi;
const DANGEROUS_CHARS_REGEX = /[<>{}[\]\\]/g;

/**
 * Server-side validation to reject inputs containing HTML/script tags
 * Complements client-side DOMPurify sanitization for defense-in-depth
 */
function validateNoHtmlContent(text: string, fieldName: string): void {
  if (HTML_TAG_REGEX.test(text)) {
    throw new Error(
      `${fieldName} contains invalid characters. HTML tags are not allowed.`,
    );
  }
}

/**
 * Validate name field: alphanumeric, spaces, hyphens, apostrophes only
 * No dangerous characters that could be used for injection
 */
function validateName(name: string, fieldName: string): void {
  validateNoHtmlContent(name, fieldName);

  if (DANGEROUS_CHARS_REGEX.test(name)) {
    throw new Error(
      `${fieldName} contains invalid characters. Only letters, numbers, spaces, hyphens, and apostrophes are allowed.`,
    );
  }
}

/**
 * Validate message field: allows more characters but still blocks HTML/scripts
 */
function validateMessage(message: string): void {
  validateNoHtmlContent(message, "Custom message");
}

// ============================================================================
// Mutations
// ============================================================================

/**
 * Create a new festival greeting
 *
 * Generates a unique shareable ID and stores greeting data
 * Implements retry logic on ID collision (extremely rare)
 */
export const createGreeting = mutation({
  args: {
    festivalType: v.string(),
    relationshipType: v.string(),
    recipientName: v.string(),
    senderName: v.string(),
    customMessage: v.optional(v.string()),
    templateId: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate festival type against whitelist
    if (
      !VALID_FESTIVAL_TYPES.includes(
        args.festivalType as (typeof VALID_FESTIVAL_TYPES)[number],
      )
    ) {
      throw new Error(
        `Invalid festival type. Must be one of: ${VALID_FESTIVAL_TYPES.join(", ")}`,
      );
    }

    // Validate relationship type against whitelist
    if (
      !VALID_RELATIONSHIP_TYPES.includes(
        args.relationshipType as (typeof VALID_RELATIONSHIP_TYPES)[number],
      )
    ) {
      throw new Error(
        `Invalid relationship type. Must be one of: ${VALID_RELATIONSHIP_TYPES.join(", ")}`,
      );
    }

    // Validate template ID against whitelist
    if (
      !VALID_TEMPLATE_IDS.includes(
        args.templateId as (typeof VALID_TEMPLATE_IDS)[number],
      )
    ) {
      throw new Error(
        `Invalid template ID. Must be one of: ${VALID_TEMPLATE_IDS.join(", ")}`,
      );
    }

    // Validate and sanitize input lengths
    const recipientName = args.recipientName.trim();
    const senderName = args.senderName.trim();

    if (!recipientName || recipientName.length < 1) {
      throw new Error("Recipient name is required");
    }

    if (!senderName || senderName.length < 1) {
      throw new Error("Sender name is required");
    }

    if (recipientName.length > 50) {
      throw new Error("Recipient name must be 50 characters or less");
    }

    if (senderName.length > 50) {
      throw new Error("Sender name must be 50 characters or less");
    }

    if (args.customMessage && args.customMessage.length > 150) {
      throw new Error("Custom message must be 150 characters or less");
    }

    // Server-side XSS prevention: validate no HTML/script content
    validateName(recipientName, "Recipient name");
    validateName(senderName, "Sender name");

    if (args.customMessage) {
      validateMessage(args.customMessage);
    }

    try {
      // Generate unique shareable ID (retry if collision)
      let shareableId = "";
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        shareableId = generateShareableId();

        // Check for collision
        const existing = await ctx.db
          .query("greetings")
          .withIndex("by_shareable_id", (q) => q.eq("shareableId", shareableId))
          .first();

        if (!existing) {
          break; // ID is unique
        }

        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error(
            "We're having trouble creating your greeting right now. Please try again in a moment.",
          );
        }
      }

      if (!shareableId) {
        throw new Error(
          "Unable to generate a unique link for your greeting. Please try again.",
        );
      }

      // Generate contextual message if custom message not provided
      const generatedMessage = args.customMessage
        ? undefined
        : generateContextualMessage(
            args.festivalType,
            args.relationshipType,
            args.recipientName,
          );

      // Create greeting document
      const greetingId = await ctx.db.insert("greetings", {
        festivalType: args.festivalType,
        relationshipType: args.relationshipType,
        recipientName: args.recipientName.trim(),
        senderName: args.senderName.trim(),
        customMessage: args.customMessage?.trim(),
        generatedMessage,
        templateId: args.templateId,
        shareableId: shareableId,
        viewCount: 0,
        createdAt: Date.now(),
        status: "active",
      });

      return {
        greetingId,
        shareableId: shareableId,
      };
    } catch (error) {
      // Database operation failed - provide user-friendly message
      if (error instanceof Error && error.message.includes("try again")) {
        // Re-throw our custom error messages
        throw error;
      }

      // Unexpected database error
      throw new Error(
        "We couldn't save your greeting. Please check your connection and try again.",
      );
    }
  },
});

/**
 * Increment view count for a greeting
 *
 * Fire-and-forget operation that atomically increments view count
 * Fails silently if greeting not found (non-critical tracking)
 */
export const incrementViewCount = mutation({
  args: {
    greetingId: v.id("greetings"),
  },
  handler: async (ctx, args) => {
    try {
      const greeting = await ctx.db.get(args.greetingId);

      if (!greeting) {
        // Silent failure - view tracking is non-critical
        return { success: false };
      }

      // Atomic increment
      await ctx.db.patch(args.greetingId, {
        viewCount: greeting.viewCount + 1,
      });

      return { success: true };
    } catch (error) {
      // Log error but don't throw (non-critical operation)
      console.error(
        JSON.stringify({
          level: "error",
          message: "Failed to increment view count",
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          function: "incrementViewCount",
          timestamp: new Date().toISOString(),
        }),
      );
      return { success: false };
    }
  },
});

// ============================================================================
// Queries
// ============================================================================

/**
 * Get greeting by shareable ID
 *
 * Used by view page to display greeting content
 * Returns null if greeting not found or inactive
 */
export const getGreetingByShareableId = query({
  args: {
    shareableId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const greeting = await ctx.db
        .query("greetings")
        .withIndex("by_shareable_id", (q) =>
          q.eq("shareableId", args.shareableId),
        )
        .first();

      if (!greeting) {
        return null;
      }

      // Only return active greetings
      if (greeting.status !== "active") {
        return null;
      }

      return greeting;
    } catch (error) {
      // Database read error - log and return null (will trigger 404)
      console.error(
        JSON.stringify({
          level: "error",
          message: "Failed to fetch greeting",
          shareableId: args.shareableId,
          error: error instanceof Error ? error.message : String(error),
          function: "getGreetingByShareableId",
          timestamp: new Date().toISOString(),
        }),
      );
      return null;
    }
  },
});

/**
 * Get recent greetings (for future analytics)
 *
 * Post-MVP: Used for creator dashboard and analytics
 */
export const getRecentGreetings = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;

    const greetings = await ctx.db
      .query("greetings")
      .withIndex("by_created_at")
      .order("desc")
      .take(limit);

    return greetings;
  },
});

/**
 * Get greeting count by festival type (for future analytics)
 */
export const getGreetingCountByFestival = query({
  args: {
    festivalType: v.string(),
  },
  handler: async (ctx, args) => {
    const greetings = await ctx.db
      .query("greetings")
      .withIndex("by_festival_type", (q) =>
        q.eq("festivalType", args.festivalType),
      )
      .collect();

    return greetings.length;
  },
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate contextual message based on festival and relationship
 *
 * @param festivalType - Type of festival
 * @param relationshipType - Type of relationship
 * @param recipientName - Name of recipient
 * @returns Generated message
 */
function generateContextualMessage(
  festivalType: string,
  relationshipType: string,
  recipientName: string,
): string {
  const messages: Record<string, Record<string, string>> = {
    diwali: {
      parents: `Dear ${recipientName}, wishing you a Diwali filled with light, prosperity, and countless blessings.`,
      siblings: `Hey ${recipientName}! Have an amazing Diwali filled with sweets, fun, and fireworks! 🪔`,
      friend: `${recipientName}, wishing you a sparkling Diwali full of joy and celebration!`,
      boss: `Respected ${recipientName}, wishing you and your family a prosperous and joyous Diwali.`,
      partner: `My dearest ${recipientName}, may our love shine as bright as the Diwali diyas. ✨`,
      default: `Dear ${recipientName}, wishing you a bright and prosperous Diwali!`,
    },
    holi: {
      parents: `Dear ${recipientName}, may this Holi bring vibrant colors of joy and happiness to your life.`,
      siblings: `${recipientName}, let's paint the town colorful this Holi! Get ready for color chaos! 🎨`,
      friend: `${recipientName}, hoping your Holi is as colorful and vibrant as you are!`,
      boss: `Respected ${recipientName}, wishing you a colorful and joyous Holi celebration.`,
      partner: `${recipientName}, you bring color to my life every single day. Happy Holi! 💕`,
      default: `Dear ${recipientName}, wishing you a joyful and colorful Holi!`,
    },
    christmas: {
      parents: `Dear ${recipientName}, wishing you peace, joy, and all the blessings of Christmas.`,
      siblings: `${recipientName}, Merry Christmas! May your holidays be filled with joy and presents! 🎄`,
      friend: `${recipientName}, wishing you a Christmas filled with warmth, laughter, and good times!`,
      boss: `Respected ${recipientName}, Season's greetings and best wishes for a wonderful Christmas.`,
      partner: `${recipientName}, you're the best gift I could ask for. Merry Christmas, my love! ❤️`,
      default: `Dear ${recipientName}, wishing you a Merry Christmas and a Happy New Year!`,
    },
    newyear: {
      parents: `Dear ${recipientName}, wishing you health, happiness, and success in the new year ahead.`,
      siblings: `${recipientName}, cheers to new adventures and amazing memories in the new year! 🎉`,
      friend: `${recipientName}, here's to another year of friendship and fun! Happy New Year!`,
      boss: `Respected ${recipientName}, wishing you a successful and prosperous new year.`,
      partner: `${recipientName}, can't wait to create more beautiful memories with you. Happy New Year! 💫`,
      default: `Dear ${recipientName}, wishing you a Happy New Year filled with new opportunities!`,
    },
    pongal: {
      parents: `Dear ${recipientName}, may this Pongal bring abundance, prosperity, and good health to you.`,
      siblings: `${recipientName}, Happy Pongal! May the harvest bring sweetness to your life! 🌾`,
      friend: `${recipientName}, wishing you a Pongal filled with joy, prosperity, and delicious food!`,
      boss: `Respected ${recipientName}, wishing you and your family a prosperous Pongal celebration.`,
      partner: `${recipientName}, grateful for our harvest of love. Happy Pongal, my dear! 🌻`,
      default: `Dear ${recipientName}, wishing you a bountiful and happy Pongal!`,
    },
    generic: {
      parents: `Dear ${recipientName}, sending you love and warm wishes on this special occasion.`,
      siblings: `${recipientName}, wishing you an amazing celebration filled with joy and fun!`,
      friend: `${recipientName}, hope your celebration is as wonderful as you are!`,
      boss: `Respected ${recipientName}, best wishes for a joyous celebration.`,
      partner: `${recipientName}, you make every celebration special. Love you! ✨`,
      default: `Dear ${recipientName}, wishing you joy and happiness on this special day!`,
    },
  };

  const festivalMessages = messages[festivalType] || messages.generic;
  return (
    festivalMessages[relationshipType] ||
    festivalMessages.default ||
    `Dear ${recipientName}, wishing you joy and happiness!`
  );
}
