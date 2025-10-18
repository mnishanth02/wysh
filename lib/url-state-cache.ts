/**
 * Server-side URL State Cache
 * Enables type-safe access to URL parameters in Server Components
 *
 * Usage in Server Components/Pages:
 * ```tsx
 * export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[]>> }) {
 *   const { festival, relationship } = await greetingCache.parse(searchParams);
 *   // festival and relationship are now type-safe and non-nullable
 * }
 * ```
 */

import { createSearchParamsCache } from "nuqs/server";
import { greetingParsers } from "./url-state-parsers";

/**
 * Cache for greeting creation flow parameters
 * Provides type-safe, optimized access to URL state in Server Components
 */
export const greetingCache = createSearchParamsCache(greetingParsers);

/**
 * Type-safe search params for greeting creation flow
 * Extract the parsed type for use in Server Components
 */
export type GreetingSearchParams = Awaited<
  ReturnType<typeof greetingCache.parse>
>;
