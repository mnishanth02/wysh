/**
 * Convex Database Schema: Wysh Festival Greeting Platform
 *
 * Defines the database structure for greetings and festivals
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ============================================================================
  // Greetings Table
  // ============================================================================
  /**
   * Stores all created festival greetings with personalization data
   *
   * Key Features:
   * - Indexed by shareableId for fast URL lookups
   * - Indexed by createdAt for analytics (post-MVP)
   * - View count tracking via atomic increments
   * - Immutable after creation (no updates to greeting content)
   */
  greetings: defineTable({
    // Festival & Relationship Context
    festivalType: v.string(), // "diwali" | "holi" | "christmas" | "newyear" | "pongal" | "generic"
    relationshipType: v.string(), // "parents" | "siblings" | "friend" | "boss" | etc.

    // Personalization Data
    recipientName: v.string(), // 1-50 characters
    senderName: v.string(), // 1-50 characters
    customMessage: v.optional(v.string()), // 0-150 characters, user-provided
    generatedMessage: v.optional(v.string()), // System-generated if customMessage empty

    // Template & Sharing
    templateId: v.string(), // e.g., "diwali-template-1"
    shareableId: v.string(), // 8-char unique URL identifier (nanoid)

    // Tracking & Metadata
    viewCount: v.number(), // Anonymous view count, initialized to 0
    createdAt: v.number(), // Milliseconds since epoch
    status: v.string(), // "active" | "deleted" | "expired" (MVP: always "active")
  })
    // Index for fast lookup by shareable URL
    .index("by_shareable_id", ["shareableId"])
    // Index for analytics queries (post-MVP)
    .index("by_created_at", ["createdAt"])
    // Index for filtering by festival type (future analytics)
    .index("by_festival_type", ["festivalType"])
    // Index for filtering by status
    .index("by_status", ["status"]),

  // ============================================================================
  // Festivals Table
  // ============================================================================
  /**
   * Reference data for festival metadata, colors, and visual styling
   *
   * Key Features:
   * - Pre-populated at deployment (6 festivals)
   * - Rarely changes (static configuration)
   * - Used for template configuration and context engine
   * - No user creation/modification in MVP
   */
  festivals: defineTable({
    // Identification
    festivalId: v.string(), // Unique identifier: "diwali" | "holi" | etc.
    displayName: v.string(), // User-facing name: "Diwali (Deepavali)"
    category: v.string(), // "religious" | "cultural" | "national"

    // Visual Configuration
    colorPalette: v.array(v.string()), // Hex colors, ordered by prominence (3-6 colors)
    symbols: v.array(v.string()), // Visual elements: ["diya", "rangoli", etc.] (2-5 symbols)
    animationStyle: v.string(), // "sequential" | "burst" | "generic" | etc.

    // Status
    isActive: v.boolean(), // Whether available for greeting creation
  })
    // Index for fast lookup by festival identifier
    .index("by_festival_id", ["festivalId"])
    // Index for filtering active festivals
    .index("by_is_active", ["isActive"]),
});
