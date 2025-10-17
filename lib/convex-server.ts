/**
 * Server-side Convex Client
 * For fetching data in server components and metadata generation
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error(
    "NEXT_PUBLIC_CONVEX_URL is not defined in environment variables",
  );
}

/**
 * Get a server-side Convex client for one-off queries
 * Use this in Server Components and generateMetadata functions
 */
export function getConvexClient() {
  if (!convexUrl) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is required");
  }
  return new ConvexHttpClient(convexUrl);
}

/**
 * Fetch greeting by shareable ID (server-side)
 */
export async function fetchGreetingByShareableId(shareableId: string) {
  const client = getConvexClient();
  const greeting = await client.query(api.greetings.getGreetingByShareableId, {
    shareableId,
  });
  return greeting;
}
