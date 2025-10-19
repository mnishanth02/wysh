/**
 * Feature Flags: Wysh Festival Greeting Platform
 *
 * Centralized feature flag management for enabling/disabling festivals
 * Used across UI, routing, and backend validation layers
 */

import type { FestivalType } from "../types/index";

// ============================================================================
// Festival Feature Flags
// ============================================================================

/**
 * List of currently enabled festivals
 * Modify this array to enable/disable festivals for production releases
 *
 * @example
 * // Enable only Diwali for initial launch
 * export const ENABLED_FESTIVALS: FestivalType[] = ["diwali"];
 *
 * @example
 * // Enable multiple festivals
 * export const ENABLED_FESTIVALS: FestivalType[] = ["diwali", "christmas", "newyear"];
 */
export const ENABLED_FESTIVALS: FestivalType[] = ["diwali"];

/**
 * Check if a festival is currently enabled
 *
 * @param festivalType - The festival to check
 * @returns true if the festival is enabled, false otherwise
 *
 * @example
 * if (isFestivalEnabled("diwali")) {
 *   // Allow access to Diwali greeting creation
 * }
 */
export function isFestivalEnabled(festivalType: FestivalType): boolean {
  return ENABLED_FESTIVALS.includes(festivalType);
}

/**
 * Get list of all enabled festivals
 *
 * @returns Array of enabled festival types
 *
 * @example
 * const enabled = getEnabledFestivals();
 * // ["diwali"]
 */
export function getEnabledFestivals(): FestivalType[] {
  return [...ENABLED_FESTIVALS];
}

/**
 * Get list of all disabled festivals
 *
 * @returns Array of disabled festival types
 *
 * @example
 * const disabled = getDisabledFestivals();
 * // ["holi", "christmas", "newyear", "pongal", "generic"]
 */
export function getDisabledFestivals(): FestivalType[] {
  const allFestivals: FestivalType[] = [
    "diwali",
    "holi",
    "christmas",
    "newyear",
    "pongal",
    "generic",
  ];

  return allFestivals.filter(
    (festival) => !ENABLED_FESTIVALS.includes(festival),
  );
}

/**
 * Validate if a festival type is enabled and throw error if not
 * Used in backend mutations for server-side validation
 *
 * @param festivalType - The festival to validate
 * @throws Error if festival is not enabled
 *
 * @example
 * validateFestivalEnabled(args.festivalType);
 * // Throws: "Christmas is not available yet. Currently available festivals: Diwali"
 */
export function validateFestivalEnabled(festivalType: FestivalType): void {
  if (!isFestivalEnabled(festivalType)) {
    const enabledList = ENABLED_FESTIVALS.map(
      (f) => f.charAt(0).toUpperCase() + f.slice(1),
    ).join(", ");

    const festivalName =
      festivalType.charAt(0).toUpperCase() + festivalType.slice(1);

    throw new Error(
      `${festivalName} is not available yet. Currently available festivals: ${enabledList}`,
    );
  }
}
