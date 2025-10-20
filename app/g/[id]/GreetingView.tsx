"use client";

/**
 * Greeting View Client Component
 * Fetches and displays the animated greeting
 * T102: Implements context-aware autoplay (desktop vs mobile)
 */

import { useMutation, useQuery } from "convex/react";
import { useEffect } from "react";
import { GreetingRenderer } from "@/components/greetings/GreetingRenderer";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { api } from "@/convex/_generated/api";
import type { FestivalType, RelationshipType } from "@/types";

interface GreetingViewProps {
  shareableId: string;
}

/**
 * Key for storing viewed greeting IDs in sessionStorage
 */
const VIEWED_GREETINGS_KEY = "wysh_viewed_greetings";

/**
 * Check if greeting has already been viewed in current session
 *
 * @param greetingId - The Convex document ID of the greeting
 * @returns True if greeting has been viewed, false otherwise
 */
function hasViewedGreeting(greetingId: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const viewed = sessionStorage.getItem(VIEWED_GREETINGS_KEY);
    if (!viewed) return false;

    const viewedIds = JSON.parse(viewed) as string[];
    return viewedIds.includes(greetingId);
  } catch {
    return false;
  }
}

/**
 * Mark greeting as viewed in current session
 *
 * @param greetingId - The Convex document ID of the greeting
 */
function markGreetingAsViewed(greetingId: string): void {
  if (typeof window === "undefined") return;

  try {
    const viewed = sessionStorage.getItem(VIEWED_GREETINGS_KEY);
    const viewedIds = viewed ? (JSON.parse(viewed) as string[]) : [];

    if (!viewedIds.includes(greetingId)) {
      viewedIds.push(greetingId);
      sessionStorage.setItem(VIEWED_GREETINGS_KEY, JSON.stringify(viewedIds));
    }
  } catch {
    // Silent failure - non-critical
  }
}

export function GreetingView({ shareableId }: GreetingViewProps) {
  const greeting = useQuery(api.greetings.getGreetingByShareableId, {
    shareableId,
  });
  const incrementViewCount = useMutation(api.greetings.incrementViewCount);

  // Always autoplay on all devices
  const shouldAutoplay = true;

  useEffect(() => {
    // Increment view count when greeting loads (fire-and-forget)
    // Only increment if greeting hasn't been viewed in current session
    if (greeting?._id && !hasViewedGreeting(greeting._id)) {
      incrementViewCount({ greetingId: greeting._id })
        .then(() => {
          // Mark as viewed only after successful increment
          markGreetingAsViewed(greeting._id);
        })
        .catch(() => {
          // Silent failure - view tracking is non-critical
          console.log("View count tracking failed (non-critical)");
        });
    }
  }, [greeting?._id, incrementViewCount]);

  // No-op: Tap to Play removed

  if (greeting === undefined) {
    return <LoadingState message="Loading your greeting..." />;
  }

  if (greeting === null) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <ErrorState message="Greeting not found. Please check the URL and try again." />
      </div>
    );
  }

  return (
    <div className="relative">
      <GreetingRenderer
        festivalType={ greeting.festivalType as FestivalType }
        relationshipType={ greeting.relationshipType as RelationshipType }
        recipientName={ greeting.recipientName }
        senderName={ greeting.senderName }
        message={ greeting.customMessage || greeting.generatedMessage || "" }
        templateId={ greeting.templateId }
        autoplay={ shouldAutoplay }
      />
    </div>
  );
}
