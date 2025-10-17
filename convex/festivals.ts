/**
 * Convex Festivals Functions: Wysh Festival Greeting Platform
 *
 * Queries for retrieving festival reference data
 */

import { v } from "convex/values";
import { query } from "./_generated/server";

// ============================================================================
// Queries
// ============================================================================

/**
 * List all active festivals
 *
 * Returns all festivals available for greeting creation
 * Results are cached by Convex for performance
 */
export const listFestivals = query({
  args: {},
  handler: async (ctx) => {
    const festivals = await ctx.db
      .query("festivals")
      .withIndex("by_is_active", (q) => q.eq("isActive", true))
      .collect();

    return festivals;
  },
});

/**
 * Get festival by ID
 *
 * Returns specific festival data
 */
export const getFestivalById = query({
  args: {
    festivalId: v.string(),
  },
  handler: async (ctx, args) => {
    const festival = await ctx.db
      .query("festivals")
      .withIndex("by_festival_id", (q) => q.eq("festivalId", args.festivalId))
      .first();

    return festival;
  },
});

/**
 * List all festivals (including inactive)
 *
 * For admin/analytics purposes (post-MVP)
 */
export const listAllFestivals = query({
  args: {},
  handler: async (ctx) => {
    const festivals = await ctx.db.query("festivals").collect();
    return festivals;
  },
});
