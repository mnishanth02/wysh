/**
 * Convex Greetings Functions: Wysh Festival Greeting Platform
 *
 * Mutations and queries for creating and viewing festival greetings
 */

import { v } from "convex/values";
import { generateShareableId } from "../lib/id-generator";
import { mutation, query } from "./_generated/server";

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
    // Validate input lengths
    if (args.recipientName.length > 50) {
      throw new Error("Recipient name must be 50 characters or less");
    }
    if (args.senderName.length > 50) {
      throw new Error("Sender name must be 50 characters or less");
    }
    if (args.customMessage && args.customMessage.length > 150) {
      throw new Error("Custom message must be 150 characters or less");
    }

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
        throw new Error("Failed to generate unique ID. Please try again.");
      }
    }

    if (!shareableId) {
      throw new Error("Failed to generate shareable ID");
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
      console.error(JSON.stringify({
        level: "error",
        message: "Failed to increment view count",
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        function: "incrementViewCount",
        timestamp: new Date().toISOString(),
      }));
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
