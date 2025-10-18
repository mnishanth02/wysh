/**
 * URL State Parsers
 * Type-safe parsers for URL query parameters using nuqs
 *
 * Following nuqs best practices:
 * - Using .withDefault() to avoid nullable types
 * - Using .withOptions() for consistent history management
 * - Organized parsers for reuse across components
 * - URL key remapping for cleaner URLs
 */

import { parseAsString, parseAsStringEnum, type UrlKeys } from "nuqs";
import type { FestivalType, RelationshipType } from "@/types";

/**
 * All valid festival types
 */
const FESTIVAL_TYPES: FestivalType[] = [
  "diwali",
  "holi",
  "christmas",
  "newyear",
  "pongal",
  "generic",
];

/**
 * All valid relationship types
 */
const RELATIONSHIP_TYPES: RelationshipType[] = [
  // Family
  "parents",
  "siblings",
  "spouse",
  "children",
  "relatives",
  // Friends
  "friend",
  "best_friend",
  "neighbor",
  // Professional
  "boss",
  "colleague",
  "client",
  "mentor",
  // Romantic
  "partner",
  "fiance",
  "crush",
];

/**
 * Parsers for greeting creation flow
 * Using builder pattern for type-safe, non-nullable state
 */
export const greetingParsers = {
  // Step 1: Festival selection
  festival: parseAsStringEnum<FestivalType>(FESTIVAL_TYPES).withOptions({
    history: "push", // Enable back button navigation
    clearOnDefault: false, // Keep in URL even when default
  }),

  // Step 2: Relationship selection
  relationship: parseAsStringEnum<RelationshipType>(
    RELATIONSHIP_TYPES,
  ).withOptions({
    history: "push",
    clearOnDefault: false,
  }),

  // Step 3: Personalization fields
  recipientName: parseAsString.withDefault("").withOptions({
    history: "push",
    clearOnDefault: false, // Keep empty strings in URL
  }),

  senderName: parseAsString.withDefault("").withOptions({
    history: "push",
    clearOnDefault: false,
  }),

  customMessage: parseAsString.withDefault("").withOptions({
    history: "push",
    clearOnDefault: false,
  }),
} as const;

/**
 * URL key remapping for cleaner URLs
 * Maps internal state names to shorter URL parameter names
 * Example: ?f=diwali&r=parents&rn=John&sn=Jane
 */
export const greetingUrlKeys: UrlKeys<typeof greetingParsers> = {
  festival: "f",
  relationship: "r",
  recipientName: "rn",
  senderName: "sn",
  customMessage: "msg",
} as const;

/**
 * Individual parser exports for backward compatibility
 * and single-key usage
 */
export const festivalParser = greetingParsers.festival;
export const relationshipParser = greetingParsers.relationship;
export const stringParser = parseAsString.withDefault("").withOptions({
  clearOnDefault: false,
});
