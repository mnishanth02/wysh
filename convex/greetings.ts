/**
 * Convex Greetings Functions: Wysh Festival Greeting Platform
 *
 * Mutations and queries for creating and viewing festival greetings
 */

import { ConvexError, v } from "convex/values";
import { validateFestivalEnabled } from "../lib/feature-flags";
import { generateShareableId } from "../lib/id-generator";
import { mutation, query } from "./_generated/server";
import { RATE_LIMIT_POLICIES, rateLimiter } from "./rateLimiter";

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
 * Includes rate limiting to prevent abuse
 */
export const createGreeting = mutation({
  args: {
    festivalType: v.string(),
    relationshipType: v.string(),
    recipientName: v.string(),
    senderName: v.string(),
    customMessage: v.optional(v.string()),
    templateId: v.string(),
    clientIp: v.optional(v.string()), // IP address for rate limiting
  },
  handler: async (ctx, args) => {
    // Rate limiting - check all policies (minute, hour, day)
    const ipAddress = args.clientIp || "unknown";

    // Skip rate limiting for whitelisted IPs
    const whitelist = process.env.RATE_LIMIT_WHITELIST_IPS || "";
    const whitelistedIps = whitelist
      .split(",")
      .map((ip) => ip.trim())
      .filter((ip) => ip !== "");
    const isWhitelisted = whitelistedIps.includes(ipAddress);

    if (!isWhitelisted) {
      // Check per-minute limit
      const minuteLimit = await rateLimiter.limit(
        ctx,
        RATE_LIMIT_POLICIES.CREATE_PER_MIN,
        {
          key: ipAddress,
        },
      );

      if (!minuteLimit.ok) {
        const retryAfterSeconds = Math.ceil(
          (minuteLimit.retryAfter || 60000) / 1000,
        );

        // Log rate limit violation
        console.warn(
          JSON.stringify({
            level: "warn",
            message: "Rate limit exceeded for greeting creation",
            ip: ipAddress,
            endpoint: "createGreeting",
            policy: "perMinute",
            retryAfter: retryAfterSeconds,
            timestamp: new Date().toISOString(),
          }),
        );

        throw new ConvexError({
          code: "RATE_LIMIT_EXCEEDED",
          message: `You're creating greetings too quickly. Please wait ${retryAfterSeconds} seconds before trying again.`,
          retryAfter: minuteLimit.retryAfter || 60000,
        });
      }

      // Check per-hour limit
      const hourLimit = await rateLimiter.limit(
        ctx,
        RATE_LIMIT_POLICIES.CREATE_PER_HR,
        {
          key: ipAddress,
        },
      );

      if (!hourLimit.ok) {
        const retryAfterSeconds = Math.ceil(
          (hourLimit.retryAfter || 3600000) / 1000,
        );

        console.warn(
          JSON.stringify({
            level: "warn",
            message: "Hourly rate limit exceeded for greeting creation",
            ip: ipAddress,
            endpoint: "createGreeting",
            policy: "perHour",
            retryAfter: retryAfterSeconds,
            timestamp: new Date().toISOString(),
          }),
        );

        throw new ConvexError({
          code: "RATE_LIMIT_EXCEEDED",
          message: `You've created too many greetings this hour. Please wait ${Math.ceil(retryAfterSeconds / 60)} minutes before trying again.`,
          retryAfter: hourLimit.retryAfter || 3600000,
        });
      }

      // Check per-day limit
      const dayLimit = await rateLimiter.limit(
        ctx,
        RATE_LIMIT_POLICIES.CREATE_PER_DAY,
        {
          key: ipAddress,
        },
      );

      if (!dayLimit.ok) {
        const retryAfterSeconds = Math.ceil(
          (dayLimit.retryAfter || 86400000) / 1000,
        );

        console.warn(
          JSON.stringify({
            level: "warn",
            message: "Daily rate limit exceeded for greeting creation",
            ip: ipAddress,
            endpoint: "createGreeting",
            policy: "perDay",
            retryAfter: retryAfterSeconds,
            timestamp: new Date().toISOString(),
          }),
        );

        throw new ConvexError({
          code: "RATE_LIMIT_EXCEEDED",
          message: `You've reached the daily limit for creating greetings. Please try again tomorrow.`,
          retryAfter: dayLimit.retryAfter || 86400000,
        });
      }
    }

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

    // Validate festival is enabled via feature flags (critical security check)
    validateFestivalEnabled(
      args.festivalType as (typeof VALID_FESTIVAL_TYPES)[number],
    );

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

    if (args.customMessage && args.customMessage.length > 500) {
      throw new Error("Custom message must be 500 characters or less");
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
 * Includes rate limiting to prevent view count manipulation/scraping
 */
export const incrementViewCount = mutation({
  args: {
    greetingId: v.id("greetings"),
    clientIp: v.optional(v.string()), // IP address for rate limiting
  },
  handler: async (ctx, args) => {
    try {
      // Rate limiting for view tracking (prevent scraping/manipulation)
      const ipAddress = args.clientIp || "unknown";

      // Skip rate limiting for whitelisted IPs
      const whitelist = process.env.RATE_LIMIT_WHITELIST_IPS || "";
      const whitelistedIps = whitelist
        .split(",")
        .map((ip) => ip.trim())
        .filter((ip) => ip !== "");
      const isWhitelisted = whitelistedIps.includes(ipAddress);

      if (!isWhitelisted) {
        // Check view rate limit (100 views per minute per IP)
        const viewLimit = await rateLimiter.limit(
          ctx,
          RATE_LIMIT_POLICIES.VIEW,
          {
            key: ipAddress,
          },
        );

        if (!viewLimit.ok) {
          // Log rate limit violation but don't throw (non-critical operation)
          console.warn(
            JSON.stringify({
              level: "warn",
              message: "View rate limit exceeded",
              ip: ipAddress,
              greetingId: args.greetingId,
              endpoint: "incrementViewCount",
              timestamp: new Date().toISOString(),
            }),
          );
          // Return success false but don't throw error
          return { success: false, rateLimited: true };
        }
      }

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
  // Comprehensive message templates for all 15 relationship types × 6 festivals
  // Messages are culturally appropriate, warm, and relationship-specific
  const messages: Record<string, Record<string, string>> = {
    diwali: {
      // Family - Formal tone
      parents: `Dear ${recipientName}, may this auspicious Diwali illuminate your life with divine blessings, good health, and endless happiness. Wishing you a joyous festival of lights! 🪔`,
      spouse: `Dear ${recipientName}, may our bond grow stronger with each diya we light together. Wishing us a blessed and prosperous Diwali filled with love and joy. 🪔✨`,
      children: `Dearest ${recipientName}, may this Diwali bring you success, happiness, and all the joy your heart can hold. Have a wonderful celebration, my dear! 🪔🎉`,
      relatives: `Dear ${recipientName}, wishing you and your family a bright and prosperous Diwali filled with love, laughter, and countless blessings. 🪔`,

      // Family - Casual tone
      siblings: `Hey ${recipientName}! 🪔✨ Hope your Diwali is absolutely amazing with tons of sweets, sparkly diyas, and loads of fun! Let's celebrate big!`,

      // Friends - Casual tone
      friend: `${recipientName}, wishing you a sparkling Diwali full of joy, laughter, and awesome celebrations! Let's light it up! 🪔✨`,
      best_friend: `${recipientName}! 🪔 Happy Diwali to my favorite person! May your festival be as bright and amazing as you are! Let's make it unforgettable!`,
      neighbor: `Hi ${recipientName}! Wishing you and your family a wonderful Diwali filled with light, prosperity, and joyful celebrations! 🪔😊`,

      // Professional
      boss: `Respected ${recipientName}, wishing you and your family a prosperous and joyous Diwali. May this festival bring new opportunities and continued success. 🪔`,
      colleague: `Hi ${recipientName}, wishing you a bright and prosperous Diwali! May this festival bring joy and success to you and your loved ones. 🪔`,
      client: `Dear ${recipientName}, wishing you a wonderful Diwali celebration. May this festival bring prosperity and new opportunities to your ventures. 🪔`,
      mentor: `Respected ${recipientName}, wishing you a blessed Diwali filled with joy and prosperity. Thank you for your continued guidance and support. 🪔`,

      // Romantic - Intimate tone
      partner: `My dearest ${recipientName}, you light up my world every day just like the beautiful Diwali diyas. Wishing us a magical celebration together. Love you! 🪔💕`,
      fiance: `${recipientName}, my love, as we celebrate this Diwali together, I'm grateful for our beautiful journey. Here's to our bright future! 🪔💑`,
      crush: `Hi ${recipientName}, wishing you a wonderful Diwali filled with happiness and beautiful moments. Hope your festival is as bright as your smile! 🪔✨`,

      default: `Dear ${recipientName}, wishing you a bright and prosperous Diwali filled with joy and blessings! 🪔`,
    },

    holi: {
      // Family - Formal tone
      parents: `Dear ${recipientName}, may the vibrant colors of Holi bring renewed joy, good health, and happiness to your life. Wishing you a blessed celebration! 🎨`,
      spouse: `Dear ${recipientName}, may our love be as colorful and vibrant as this beautiful festival. Wishing us a joyful Holi celebration together! 🎨💕`,
      children: `Dearest ${recipientName}, may your Holi be filled with colors, laughter, and endless joy! Have a fantastic celebration, my dear! 🎨🌈`,
      relatives: `Dear ${recipientName}, wishing you a colorful and joyous Holi! May this festival bring happiness and prosperity to your family. 🎨`,

      // Family - Casual tone
      siblings: `${recipientName}! 🎨🌈 Get ready for the most colorful Holi ever! Let's paint the town and have a blast! Color attack incoming!`,

      // Friends - Casual tone
      friend: `${recipientName}, happy Holi! 🎨 May your life be as colorful and vibrant as you are! Let's make this celebration unforgettable!`,
      best_friend: `${recipientName}! 🎨🌈 Holi with you is always epic! Ready for colors, chaos, and crazy fun? Let's do this!`,
      neighbor: `Hi ${recipientName}! Wishing you a wonderful Holi filled with colors, joy, and beautiful memories with your loved ones! 🎨😊`,

      // Professional
      boss: `Respected ${recipientName}, wishing you a vibrant and joyous Holi. May this colorful festival bring fresh energy and continued success. 🎨`,
      colleague: `Hi ${recipientName}, wishing you a colorful and joyful Holi celebration! May this festival bring happiness and positivity. 🎨`,
      client: `Dear ${recipientName}, wishing you a wonderful Holi! May this festival of colors bring joy and prosperity to your endeavors. 🎨`,
      mentor: `Respected ${recipientName}, wishing you a joyful Holi celebration. May this colorful festival bring happiness and renewed inspiration. 🎨`,

      // Romantic - Intimate tone
      partner: `${recipientName}, my love, you bring color to my world every single day. Can't wait to celebrate this beautiful Holi with you! 🎨💕`,
      fiance: `${recipientName}, as we celebrate Holi together, every moment with you feels like a burst of colors. Love you endlessly! 🎨💑`,
      crush: `Hi ${recipientName}, wishing you a colorful Holi! May your celebration be as bright and beautiful as you are! 🎨✨`,

      default: `Dear ${recipientName}, wishing you a joyful and colorful Holi celebration! 🎨`,
    },

    christmas: {
      // Family - Formal tone
      parents: `Dear ${recipientName}, wishing you a blessed Christmas filled with peace, love, and the warmth of family. May this season bring you endless joy. 🎄`,
      spouse: `Dear ${recipientName}, you're my greatest blessing. Merry Christmas to us, my love. Here's to creating magical memories together! 🎄❤️`,
      children: `Dearest ${recipientName}, Merry Christmas! May Santa bring you everything you wished for and may your holidays be filled with joy! 🎄🎁`,
      relatives: `Dear ${recipientName}, wishing you and your family a wonderful Christmas filled with love, laughter, and beautiful moments! 🎄`,

      // Family - Casual tone
      siblings: `${recipientName}! 🎄🎁 Merry Christmas! Hope Santa loads you up with awesome gifts! Let's make this holiday super fun!`,

      // Friends - Casual tone
      friend: `${recipientName}, Merry Christmas! 🎄 Wishing you cozy vibes, great times, and lots of holiday cheer! Let's celebrate!`,
      best_friend: `${recipientName}! 🎄🎁 Merry Christmas to my favorite person! Hope your holidays are as awesome as you are! Let's party!`,
      neighbor: `Hi ${recipientName}! Wishing you a Merry Christmas and a wonderful holiday season filled with warmth and joy! 🎄😊`,

      // Professional
      boss: `Respected ${recipientName}, Season's greetings! Wishing you a wonderful Christmas and a prosperous new year ahead. 🎄`,
      colleague: `Hi ${recipientName}, Merry Christmas! Wishing you a joyful holiday season and a happy new year ahead! 🎄`,
      client: `Dear ${recipientName}, wishing you a Merry Christmas and prosperity in the coming year. Thank you for your continued partnership. 🎄`,
      mentor: `Respected ${recipientName}, wishing you a blessed Christmas. Thank you for your guidance and support throughout the year. 🎄`,

      // Romantic - Intimate tone
      partner: `${recipientName}, you're the most precious gift in my life. Merry Christmas to us, my love. Forever grateful for you! 🎄❤️`,
      fiance: `${recipientName}, my love, our first Christmas together is magical. Here's to a lifetime of beautiful celebrations! 🎄💑`,
      crush: `Hi ${recipientName}, Merry Christmas! Wishing you wonderful holiday moments and joy throughout the season! 🎄✨`,

      default: `Dear ${recipientName}, wishing you a Merry Christmas and a Happy New Year! 🎄`,
    },

    newyear: {
      // Family - Formal tone
      parents: `Dear ${recipientName}, as we welcome the new year, may it bring you good health, prosperity, and endless happiness. Wishing you a wonderful year ahead! 🎉`,
      spouse: `Dear ${recipientName}, here's to another year of love, partnership, and beautiful memories together. Happy New Year, my love! 🎉💕`,
      children: `Dearest ${recipientName}, Happy New Year! May this year bring you success, happiness, and all your dreams come true! 🎉✨`,
      relatives: `Dear ${recipientName}, wishing you and your family a Happy New Year filled with health, prosperity, and joyful moments! 🎉`,

      // Family - Casual tone
      siblings: `${recipientName}! 🎉🥳 Happy New Year! Let's make this year absolutely epic with crazy adventures and awesome memories!`,

      // Friends - Casual tone
      friend: `${recipientName}, Happy New Year! 🎉 Here's to another year of friendship, fun times, and unforgettable moments!`,
      best_friend: `${recipientName}! 🎉🥳 New year, same awesome friendship! Let's make this year the best one yet! Cheers to us!`,
      neighbor: `Hi ${recipientName}! Wishing you a Happy New Year filled with joy, success, and wonderful moments ahead! 🎉😊`,

      // Professional
      boss: `Respected ${recipientName}, wishing you a successful and prosperous new year. Looking forward to continued achievements ahead. 🎉`,
      colleague: `Hi ${recipientName}, Happy New Year! Wishing you success and happiness in all your endeavors this year! 🎉`,
      client: `Dear ${recipientName}, Happy New Year! Wishing you prosperity and exciting opportunities in the year ahead. 🎉`,
      mentor: `Respected ${recipientName}, Happy New Year! Thank you for your continued guidance. Wishing you success and fulfillment ahead. 🎉`,

      // Romantic - Intimate tone
      partner: `${recipientName}, my darling, cheers to another year of endless love and beautiful moments with you. You make every day special! 🎉💑`,
      fiance: `${recipientName}, my love, as we step into this new year together, I'm excited for our beautiful journey ahead. Love you! 🎉💕`,
      crush: `Hi ${recipientName}, Happy New Year! Wishing you an amazing year filled with happiness and wonderful surprises! 🎉✨`,

      default: `Dear ${recipientName}, wishing you a Happy New Year filled with new opportunities and success! 🎉`,
    },

    pongal: {
      // Family - Formal tone
      parents: `Dear ${recipientName}, may this sacred Pongal bring abundance, prosperity, and good health to your life. Wishing you a blessed harvest festival! 🌾`,
      spouse: `Dear ${recipientName}, grateful for our harvest of love and togetherness. Wishing us a wonderful Pongal celebration! 🌾💕`,
      children: `Dearest ${recipientName}, Happy Pongal! May this harvest festival bring you joy, prosperity, and sweet moments! 🌾☀️`,
      relatives: `Dear ${recipientName}, wishing you and your family a prosperous Pongal filled with abundance and happiness! 🌾`,

      // Family - Casual tone
      siblings: `${recipientName}! 🌾☀️ Happy Pongal! May your harvest be full of sweetness and your year full of awesome times!`,

      // Friends - Casual tone
      friend: `${recipientName}, Happy Pongal! 🌾 Wishing you a harvest of joy, prosperity, and lots of delicious treats!`,
      best_friend: `${recipientName}! 🌾☀️ Happy Pongal to my favorite person! May this festival bring you all the happiness you deserve!`,
      neighbor: `Hi ${recipientName}! Wishing you a wonderful Pongal celebration filled with joy and prosperity! 🌾😊`,

      // Professional
      boss: `Respected ${recipientName}, wishing you a prosperous Pongal. May this harvest festival bring growth and success to all endeavors. 🌾`,
      colleague: `Hi ${recipientName}, Happy Pongal! Wishing you abundance and success in all your undertakings! 🌾`,
      client: `Dear ${recipientName}, wishing you a prosperous Pongal! May this harvest festival bring growth and new opportunities. 🌾`,
      mentor: `Respected ${recipientName}, wishing you a blessed Pongal. May this festival bring abundance and continued success. 🌾`,

      // Romantic - Intimate tone
      partner: `${recipientName}, my love, grateful for our beautiful harvest of love and happiness. Wishing us a wonderful Pongal together! 🌾💕`,
      fiance: `${recipientName}, as we celebrate Pongal, I'm thankful for our journey together. Here's to our abundant future! 🌾💑`,
      crush: `Hi ${recipientName}, Happy Pongal! Wishing you a harvest full of happiness and beautiful moments! 🌾✨`,

      default: `Dear ${recipientName}, wishing you a bountiful and happy Pongal! 🌾`,
    },

    generic: {
      // Family - Formal tone
      parents: `Dear ${recipientName}, sending you love and warm wishes on this special occasion. May it bring you joy and happiness. ✨`,
      spouse: `Dear ${recipientName}, every celebration is special when I'm with you. Wishing us wonderful moments together! 💕`,
      children: `Dearest ${recipientName}, wishing you joy and happiness on this special day! Have a fantastic celebration! 🎉`,
      relatives: `Dear ${recipientName}, wishing you and your family joy and happiness on this special occasion! ✨`,

      // Family - Casual tone
      siblings: `${recipientName}! 🎉✨ Hope you have an absolutely amazing celebration filled with fun and laughter!`,

      // Friends - Casual tone
      friend: `${recipientName}, hope your celebration is as wonderful and amazing as you are! Have a great time! ✨🎉`,
      best_friend: `${recipientName}! ✨🎉 Wishing you the best celebration ever! You deserve all the happiness in the world!`,
      neighbor: `Hi ${recipientName}! Wishing you a wonderful celebration filled with joy and happiness! ✨😊`,

      // Professional
      boss: `Respected ${recipientName}, best wishes on this special occasion. May it bring continued success and prosperity. ✨`,
      colleague: `Hi ${recipientName}, wishing you joy and happiness on this special occasion! Have a wonderful celebration! ✨`,
      client: `Dear ${recipientName}, warm wishes on this occasion. May it bring prosperity and success to your endeavors. ✨`,
      mentor: `Respected ${recipientName}, wishing you happiness and continued success on this special occasion. ✨`,

      // Romantic - Intimate tone
      partner: `${recipientName}, you make every celebration special. Every moment with you is a gift. Love you always! 💕✨`,
      fiance: `${recipientName}, my love, celebrating with you makes every occasion magical. Here's to us and our beautiful future! 💑✨`,
      crush: `Hi ${recipientName}, wishing you a wonderful celebration filled with joy and beautiful moments! ✨💫`,

      default: `Dear ${recipientName}, wishing you joy and happiness on this special day! ✨`,
    },
  };

  const festivalMessages = messages[festivalType] || messages.generic;
  return (
    festivalMessages[relationshipType] ||
    festivalMessages.default ||
    `Dear ${recipientName}, wishing you joy and happiness! ✨`
  );
}
