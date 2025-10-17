/**
 * ID Generator: Wysh Festival Greeting Platform
 *
 * Generates unique, URL-safe identifiers for shareable greeting links
 * Uses nanoid for cryptographically secure random IDs
 */

import { customAlphabet } from "nanoid";
import { VALIDATION_CONSTRAINTS } from "./constants";

// ============================================================================
// Configuration
// ============================================================================

/**
 * Custom alphabet for URL-safe IDs
 * Excludes similar-looking characters: 0/O, 1/l/I, etc.
 * Uses: lowercase letters + numbers (except confusing ones)
 */
const ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz";

/**
 * ID length for shareable links
 */
const ID_LENGTH = VALIDATION_CONSTRAINTS.SHAREABLE_ID_LENGTH;

/**
 * Create nanoid generator with custom alphabet
 */
const nanoid = customAlphabet(ALPHABET, ID_LENGTH);

// ============================================================================
// ID Generation
// ============================================================================

/**
 * Generate a unique, URL-safe shareable ID
 *
 * @returns 8-character unique ID
 *
 * @example
 * const id = generateShareableId();
 * // Returns: "a7x9k2m1"
 */
export function generateShareableId(): string {
  return nanoid();
}

/**
 * Validate shareable ID format
 *
 * @param id - The ID to validate
 * @returns True if ID is valid format
 *
 * @example
 * isValidShareableId("a7x9k2m1") // true
 * isValidShareableId("invalid!") // false
 */
export function isValidShareableId(id: string): boolean {
  if (id.length !== ID_LENGTH) {
    return false;
  }

  // Check all characters are in alphabet
  return id.split("").every((char) => ALPHABET.includes(char));
}

/**
 * Calculate collision probability for given number of IDs
 *
 * Helpful for monitoring scaling needs
 *
 * @param numIds - Number of IDs generated
 * @returns Probability of collision (0-1)
 *
 * @example
 * getCollisionProbability(1000) // Very low probability
 */
export function getCollisionProbability(numIds: number): number {
  const possibleIds = ALPHABET.length ** ID_LENGTH;
  // Birthday problem approximation
  return 1 - Math.exp((-numIds * (numIds - 1)) / (2 * possibleIds));
}

/**
 * Get estimated capacity before 1% collision risk
 *
 * @returns Number of IDs that can be safely generated
 */
export function getSafeCapacity(): number {
  const possibleIds = ALPHABET.length ** ID_LENGTH;
  // Aim for <1% collision probability
  return Math.floor(Math.sqrt(2 * possibleIds * 0.01));
}

// ============================================================================
// Batch Generation (for testing/seeding)
// ============================================================================

/**
 * Generate multiple unique IDs
 *
 * @param count - Number of IDs to generate
 * @returns Array of unique IDs
 *
 * @example
 * const ids = generateBatchIds(10);
 * // Returns: ["a7x9k2m1", "x3k8n2p4", ...]
 */
export function generateBatchIds(count: number): string[] {
  const ids = new Set<string>();

  while (ids.size < count) {
    ids.add(generateShareableId());
  }

  return Array.from(ids);
}

// ============================================================================
// Debug Utilities
// ============================================================================

/**
 * Get ID generation statistics
 *
 * @returns Statistics about ID space
 */
export function getIdStatistics() {
  const possibleIds = ALPHABET.length ** ID_LENGTH;
  const safeCapacity = getSafeCapacity();

  return {
    alphabetSize: ALPHABET.length,
    idLength: ID_LENGTH,
    totalPossibleIds: possibleIds,
    safeCapacity,
    collisionRiskAt: {
      "1000 IDs": getCollisionProbability(1000).toExponential(2),
      "10000 IDs": getCollisionProbability(10000).toExponential(2),
      "100000 IDs": getCollisionProbability(100000).toExponential(2),
    },
  };
}

// ============================================================================
// Exports
// ============================================================================

export const idGenerator = {
  generate: generateShareableId,
  validate: isValidShareableId,
  getCollisionProbability,
  getSafeCapacity,
  generateBatch: generateBatchIds,
  getStatistics: getIdStatistics,
};
