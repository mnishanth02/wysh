/**
 * Festival Theme Configuration
 * Color palettes and cultural symbolism for festival animations
 */

import type { RelationshipContext } from "@/types";

/**
 * Diwali Color Palette
 * Cultural symbolism:
 * - Orange #FF6B35: Saffron/spirituality - represents divine light and enlightenment
 * - Gold #FFA500: Prosperity/wealth - symbolizes abundance and good fortune
 * - Red #DC143C: Auspiciousness/celebration - sacred color for festivals
 * - White #FFFFFF: Purity/peace - represents divine energy and cleanliness
 */
export const DIWALI_COLORS = [
  "#FF6B35",
  "#FFA500",
  "#DC143C",
  "#FFFFFF",
] as const;

/**
 * New Year Color Palette
 * Cultural symbolism:
 * - Blue #1E90FF: New beginnings - fresh start and optimism
 * - Red #FF1493: Passion/excitement - energy and celebration
 * - Gold #FFD700: Prosperity - wealth and success in the new year
 * - Green #32CD32: Growth - renewal and progress
 * - Purple #9370DB: Luxury - sophistication and ambition
 * - Silver #C0C0C0: Modernity - contemporary celebration
 */
export const NEWYEAR_COLORS = [
  "#1E90FF",
  "#FF1493",
  "#FFD700",
  "#32CD32",
  "#9370DB",
  "#C0C0C0",
] as const;

/**
 * Pongal Color Palette
 * Cultural symbolism:
 * - Orange #FF8C00: Harvest warmth - sun and agricultural prosperity
 * - Yellow #FFEB3B: Turmeric/prosperity - sacred spice and abundance
 * - Terracotta #D2691E: Earthen pot tradition - traditional cooking vessel
 * - Red #DC143C: Auspiciousness - sacred color for Tamil festivals
 * - Cream #F5F5DC: Rice/abundance - staple harvest grain
 */
export const PONGAL_COLORS = [
  "#FF8C00",
  "#FFEB3B",
  "#D2691E",
  "#DC143C",
  "#F5F5DC",
] as const;

/**
 * Fireworks Color Palette (multi-context)
 * Vibrant celebration colors suitable for any festive occasion
 */
export const FIREWORKS_COLORS = [
  "#FF6B35",
  "#FFD700",
  "#1E90FF",
  "#FF1493",
  "#32CD32",
  "#9370DB",
] as const;

export type FestivalType = "diwali" | "newyear" | "pongal" | "fireworks";

/**
 * Get base color palette for a festival
 */
export function getFestivalColors(festival: FestivalType): readonly string[] {
  switch (festival) {
    case "diwali":
      return DIWALI_COLORS;
    case "newyear":
      return NEWYEAR_COLORS;
    case "pongal":
      return PONGAL_COLORS;
    case "fireworks":
      return FIREWORKS_COLORS;
    default:
      return FIREWORKS_COLORS;
  }
}

/**
 * Relationship color variant adjustments
 */
type ColorVariant = "muted" | "traditional" | "vibrant" | "pastel";

/**
 * Get relationship-appropriate color variant
 */
export function getRelationshipColorVariant(
  relationshipType: RelationshipContext["relationshipType"],
): ColorVariant {
  switch (relationshipType) {
    case "boss":
    case "colleague":
    case "client":
    case "mentor":
      return "muted";
    case "parents":
    case "children":
    case "relatives":
      return "traditional";
    case "friend":
    case "best_friend":
    case "neighbor":
    case "siblings":
      return "vibrant";
    case "partner":
    case "spouse":
    case "fiance":
    case "crush":
      return "pastel";
    default:
      return "traditional";
  }
}

/**
 * Adjust color palette based on relationship context
 */
export function getRelationshipColorPalette(
  festival: FestivalType,
  relationshipType: RelationshipContext["relationshipType"],
): string[] {
  const baseColors = [...getFestivalColors(festival)];
  const variant = getRelationshipColorVariant(relationshipType);

  return baseColors.map((color) => adjustColorForVariant(color, variant));
}

/**
 * Adjust individual color based on variant
 */
function adjustColorForVariant(
  hexColor: string,
  variant: ColorVariant,
): string {
  // Parse hex color
  const r = Number.parseInt(hexColor.slice(1, 3), 16);
  const g = Number.parseInt(hexColor.slice(3, 5), 16);
  const b = Number.parseInt(hexColor.slice(5, 7), 16);

  let newR = r;
  let newG = g;
  let newB = b;

  switch (variant) {
    case "muted":
      // Reduce saturation by 30%
      newR = Math.floor(r * 0.7 + 128 * 0.3);
      newG = Math.floor(g * 0.7 + 128 * 0.3);
      newB = Math.floor(b * 0.7 + 128 * 0.3);
      break;
    case "vibrant":
      // Increase saturation by 20%
      newR = Math.min(255, Math.floor(r * 1.2));
      newG = Math.min(255, Math.floor(g * 1.2));
      newB = Math.min(255, Math.floor(b * 1.2));
      break;
    case "pastel":
      // Add white tint (blend with white 40%)
      newR = Math.floor(r * 0.6 + 255 * 0.4);
      newG = Math.floor(g * 0.6 + 255 * 0.4);
      newB = Math.floor(b * 0.6 + 255 * 0.4);
      break;
    case "traditional":
    default:
      // No adjustment
      break;
  }

  // Convert back to hex
  return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
}

/**
 * Fireworks template configuration presets
 */
export const FIREWORKS_DIWALI_CONFIG = {
  colors: DIWALI_COLORS,
  burstCount: 6,
  duration: 8000,
  particleCount: 300,
} as const;

export const FIREWORKS_NEWYEAR_CONFIG = {
  colors: NEWYEAR_COLORS,
  burstCount: 7,
  duration: 10000,
  particleCount: 500,
} as const;
