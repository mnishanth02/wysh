/**
 * Seed Festivals Data: Wysh Festival Greeting Platform
 *
 * Populates the festivals table with 6 festival documents
 * Run with: npx convex run seed:seedFestivals
 */

import { internalMutation } from "./_generated/server";

export const seedFestivals = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if festivals already exist
    const existing = await ctx.db.query("festivals").collect();

    if (existing.length > 0) {
      console.log(
        `Festivals already seeded (${existing.length} festivals found)`,
      );
      return {
        success: true,
        message: `Festivals already exist (${existing.length} found)`,
        inserted: 0,
      };
    }

    // Festival data to seed
    const festivals = [
      {
        festivalId: "diwali",
        displayName: "Diwali (Deepavali)",
        category: "religious",
        colorPalette: ["#FF6B35", "#FFA500", "#8B0000", "#FFFFFF"],
        symbols: ["diya", "rangoli", "fireworks", "lotus"],
        animationStyle: "sequential",
        isActive: true,
      },
      {
        festivalId: "holi",
        displayName: "Holi - Festival of Colors",
        category: "religious",
        colorPalette: ["#FF1493", "#FFD700", "#1E90FF", "#32CD32", "#9370DB"],
        symbols: ["color_powder", "water_balloon", "hands", "flowers"],
        animationStyle: "burst",
        isActive: true,
      },
      {
        festivalId: "christmas",
        displayName: "Christmas",
        category: "religious",
        colorPalette: ["#C41E3A", "#0C6B2E", "#FFD700", "#FFFFFF"],
        symbols: ["tree", "star", "gift", "snowflake", "bells"],
        animationStyle: "cascade",
        isActive: true,
      },
      {
        festivalId: "newyear",
        displayName: "New Year",
        category: "cultural",
        colorPalette: ["#FFD700", "#000000", "#FF6B6B", "#4ECDC4", "#95E1D3"],
        symbols: ["fireworks", "champagne", "clock", "confetti", "balloon"],
        animationStyle: "burst",
        isActive: true,
      },
      {
        festivalId: "pongal",
        displayName: "Pongal",
        category: "cultural",
        colorPalette: ["#FF8C42", "#FDEE00", "#8B4513", "#228B22"],
        symbols: ["pot", "sugarcane", "sun", "kolam", "cow"],
        animationStyle: "sequential",
        isActive: true,
      },
      {
        festivalId: "generic",
        displayName: "General Celebration",
        category: "cultural",
        colorPalette: ["#667EEA", "#764BA2", "#F093FB", "#4FACFE"],
        symbols: ["star", "heart", "confetti", "gift"],
        animationStyle: "generic",
        isActive: true,
      },
    ];

    // Insert all festivals
    const insertedIds = [];
    for (const festival of festivals) {
      const id = await ctx.db.insert("festivals", festival);
      insertedIds.push(id);
      console.log(`Inserted festival: ${festival.displayName} (${id})`);
    }

    return {
      success: true,
      message: `Successfully seeded ${insertedIds.length} festivals`,
      inserted: insertedIds.length,
      festivalIds: insertedIds,
    };
  },
});
