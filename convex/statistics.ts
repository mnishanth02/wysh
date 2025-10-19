// Statistics Queries
// Purpose: Aggregate platform statistics for homepage display

import { query } from "./_generated/server";

/**
 * Get homepage statistics
 * Returns aggregated counts for social proof display
 */
export const getHomepageStats = query({
  args: {},
  handler: async (ctx) => {
    // Get all greetings
    const greetings = await ctx.db.query("greetings").collect();

    // Calculate total greetings
    const totalGreetings = greetings.length;

    // Calculate total views (sum of all view counts)
    const totalViews = greetings.reduce(
      (sum, greeting) => sum + (greeting.viewCount || 0),
      0,
    );

    // Get unique festivals count
    const festivals = await ctx.db.query("festivals").collect();
    const festivalsSupported = festivals.length;

    return {
      totalGreetings,
      totalViews,
      festivalsSupported,
    };
  },
});
