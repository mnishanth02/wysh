/**
 * Context Engine: Wysh Festival Greeting Platform
 *
 * Maps relationship context to visual styling adjustments
 * Personalizes templates based on recipient relationship
 */

import type {
  FestivalType,
  RelationshipContext,
  RelationshipType,
} from "../types";
import {
  ANIMATION_SPEED_MULTIPLIERS,
  COLOR_INTENSITY_MULTIPLIERS,
  FESTIVALS,
  RELATIONSHIP_CONTEXT_MAP,
} from "./constants";

// ============================================================================
// Context Resolution
// ============================================================================

/**
 * Get relationship context for a given relationship type
 *
 * @param relationshipType - The relationship type to get context for
 * @returns Full relationship context with visual styling parameters
 *
 * @example
 * const context = getRelationshipContext("boss");
 * // Returns: { category: "professional", visualTone: "formal", ... }
 */
export function getRelationshipContext(
  relationshipType: RelationshipType,
): RelationshipContext {
  const mapping = RELATIONSHIP_CONTEXT_MAP[relationshipType];

  if (!mapping) {
    // Default to moderate, casual context for unknown relationships
    return {
      category: "friends",
      relationshipType,
      displayName: relationshipType,
      visualTone: "warm",
      colorIntensity: "moderate",
      animationSpeed: "medium",
      messageTone: "casual",
    };
  }

  return {
    category: mapping.category,
    relationshipType,
    displayName: getRelationshipDisplayName(relationshipType),
    visualTone: mapping.visualTone,
    colorIntensity: mapping.colorIntensity,
    animationSpeed: mapping.animationSpeed,
    messageTone: mapping.messageTone,
  };
}

/**
 * Get display name for relationship type
 *
 * @param relationshipType - The relationship type
 * @returns Human-readable display name
 */
function getRelationshipDisplayName(
  relationshipType: RelationshipType,
): string {
  const displayNames: Record<RelationshipType, string> = {
    parents: "Parents",
    siblings: "Siblings",
    spouse: "Spouse",
    children: "Children",
    relatives: "Relatives",
    friend: "Friend",
    best_friend: "Best Friend",
    neighbor: "Neighbor",
    boss: "Boss",
    colleague: "Colleague",
    client: "Client",
    mentor: "Mentor",
    partner: "Partner",
    fiance: "Fiancé(e)",
    crush: "Crush",
  };

  return displayNames[relationshipType] || relationshipType;
}

// ============================================================================
// Color Palette Adjustments
// ============================================================================

/**
 * Adjust color palette based on relationship context
 *
 * @param festivalType - The festival type
 * @param relationshipType - The relationship type
 * @returns Adjusted color palette
 *
 * @example
 * const colors = adjustColorPalette("diwali", "boss");
 * // Returns muted version of Diwali colors for professional context
 */
export function adjustColorPalette(
  festivalType: FestivalType,
  relationshipType: RelationshipType,
): string[] {
  const festival = FESTIVALS[festivalType as keyof typeof FESTIVALS];
  const context = getRelationshipContext(relationshipType);
  const multiplier =
    COLOR_INTENSITY_MULTIPLIERS[
      context.colorIntensity as keyof typeof COLOR_INTENSITY_MULTIPLIERS
    ];

  return festival.colorPalette.map((color: string) =>
    adjustColorIntensity(color, multiplier),
  );
}

/**
 * Adjust individual color intensity
 *
 * @param hexColor - Hex color code (e.g., "#FF6B35")
 * @param multiplier - Intensity multiplier (0.7 = muted, 1.0 = normal, 1.3 = vibrant)
 * @returns Adjusted hex color
 */
function adjustColorIntensity(hexColor: string, multiplier: number): string {
  // Parse hex color
  const hex = hexColor.replace("#", "");
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);

  // Adjust intensity
  const adjustChannel = (channel: number): number => {
    if (multiplier < 1.0) {
      // Mute: Blend with gray
      const gray = 128;
      return Math.round(channel + (gray - channel) * (1 - multiplier));
    }
    // Vibrant: Increase saturation
    const adjusted = Math.round(channel * multiplier);
    return Math.min(255, adjusted);
  };

  const newR = adjustChannel(r);
  const newG = adjustChannel(g);
  const newB = adjustChannel(b);

  // Convert back to hex
  return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
}

// ============================================================================
// Animation Adjustments
// ============================================================================

/**
 * Adjust animation duration based on relationship context
 *
 * @param baseDuration - Base animation duration in seconds
 * @param relationshipType - The relationship type
 * @returns Adjusted animation duration in seconds
 *
 * @example
 * const duration = adjustAnimationDuration(8, "boss");
 * // Returns 10.4 (slower for professional context)
 */
export function adjustAnimationDuration(
  baseDuration: number,
  relationshipType: RelationshipType,
): number {
  const context = getRelationshipContext(relationshipType);
  const multiplier =
    ANIMATION_SPEED_MULTIPLIERS[
      context.animationSpeed as keyof typeof ANIMATION_SPEED_MULTIPLIERS
    ];

  return baseDuration * multiplier;
}

/**
 * Get animation delay pattern based on relationship context
 *
 * @param relationshipType - The relationship type
 * @returns Animation delay configuration
 *
 * @example
 * const delays = getAnimationDelays("siblings");
 * // Returns fast, staggered animation pattern for playful context
 */
export function getAnimationDelays(relationshipType: RelationshipType): {
  initial: number;
  stagger: number;
  between: number;
} {
  const context = getRelationshipContext(relationshipType);

  const delayMap: Record<
    "slow" | "medium" | "fast",
    { initial: number; stagger: number; between: number }
  > = {
    slow: { initial: 500, stagger: 300, between: 800 },
    medium: { initial: 300, stagger: 200, between: 500 },
    fast: { initial: 100, stagger: 100, between: 300 },
  };

  return delayMap[context.animationSpeed as keyof typeof delayMap];
}

// ============================================================================
// Message Tone Helpers
// ============================================================================

/**
 * Get greeting prefix based on relationship context
 *
 * @param relationshipType - The relationship type
 * @returns Appropriate greeting prefix
 *
 * @example
 * getGreetingPrefix("boss") // "Respected"
 * getGreetingPrefix("friend") // "Hey"
 */
export function getGreetingPrefix(relationshipType: RelationshipType): string {
  const context = getRelationshipContext(relationshipType);

  const prefixMap: Record<
    "formal" | "casual" | "intimate" | "professional",
    string
  > = {
    formal: "Dear",
    professional: "Respected",
    casual: "Hey",
    intimate: "My dearest",
  };

  return prefixMap[context.messageTone as keyof typeof prefixMap];
}

/**
 * Get closing phrase based on relationship context
 *
 * @param relationshipType - The relationship type
 * @param festivalType - The festival type
 * @returns Appropriate closing phrase
 */
export function getClosingPhrase(
  relationshipType: RelationshipType,
  festivalType: FestivalType,
): string {
  const context = getRelationshipContext(relationshipType);

  const closingMap: Record<
    "formal" | "casual" | "intimate" | "professional",
    Record<FestivalType, string>
  > = {
    formal: {
      diwali: "May the divine light guide your path",
      holi: "May colors of joy fill your life",
      christmas: "Wishing you peace and prosperity",
      newyear: "May the new year bring success",
      pongal: "May the harvest bring abundance",
      generic: "Wishing you happiness and success",
    },
    professional: {
      diwali: "Wishing you and your family a prosperous Diwali",
      holi: "Wishing you a colorful and joyous Holi",
      christmas: "Season's greetings and best wishes",
      newyear: "Wishing you a successful year ahead",
      pongal: "Wishing you a prosperous Pongal",
      generic: "Best wishes for continued success",
    },
    casual: {
      diwali: "Have an amazing Diwali! 🪔",
      holi: "Let's paint the town colorful! 🎨",
      christmas: "Merry Christmas! 🎄",
      newyear: "Cheers to new adventures! 🎉",
      pongal: "Happy Pongal! 🌾",
      generic: "Wishing you joy and happiness! ✨",
    },
    intimate: {
      diwali: "May our love shine as bright as the diyas",
      holi: "You bring color to my life every day",
      christmas: "You're the best gift I could ask for",
      newyear: "Can't wait to create more memories with you",
      pongal: "Grateful for our harvest of love",
      generic: "You make every celebration special",
    },
  };

  return closingMap[context.messageTone as keyof typeof closingMap][
    festivalType
  ];
}

// ============================================================================
// Template Filtering
// ============================================================================

/**
 * Determine if a template is suitable for a relationship context
 *
 * @param templateComplexity - Template complexity level
 * @param relationshipType - The relationship type
 * @returns Whether template is appropriate
 */
export function isTemplateSuitableForContext(
  templateComplexity: "simple" | "moderate" | "complex",
  relationshipType: RelationshipType,
): boolean {
  const context = getRelationshipContext(relationshipType);

  // Professional contexts prefer simple to moderate templates
  if (context.category === "professional") {
    return templateComplexity !== "complex";
  }

  // Romantic contexts can use all complexity levels
  if (context.category === "romantic") {
    return true;
  }

  // Friends and family prefer moderate to complex
  return templateComplexity !== "simple";
}

// ============================================================================
// Export All Context Engine Functions
// ============================================================================

export const contextEngine = {
  getRelationshipContext,
  adjustColorPalette,
  adjustAnimationDuration,
  getAnimationDelays,
  getGreetingPrefix,
  getClosingPhrase,
  isTemplateSuitableForContext,
};
