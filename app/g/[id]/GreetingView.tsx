"use client";

/**
 * Greeting View Client Component
 * Fetches and displays the animated greeting
 */

import { useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { GreetingRenderer } from "@/components/greetings/GreetingRenderer";
import type { FestivalType, RelationshipType } from "@/types";

interface GreetingViewProps {
  shareableId: string;
}

export function GreetingView({ shareableId }: GreetingViewProps) {
  const greeting = useQuery(api.greetings.getGreetingByShareableId, {
    shareableId,
  });
  const incrementViewCount = useMutation(api.greetings.incrementViewCount);

  useEffect(() => {
    // Increment view count when greeting loads (fire-and-forget)
    if (greeting?._id) {
      incrementViewCount({ greetingId: greeting._id }).catch(() => {
        // Silent failure - view tracking is non-critical
        console.log("View count tracking failed (non-critical)");
      });
    }
  }, [greeting?._id, incrementViewCount]);

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
    <GreetingRenderer
      festivalType={greeting.festivalType as FestivalType}
      relationshipType={greeting.relationshipType as RelationshipType}
      recipientName={greeting.recipientName}
      senderName={greeting.senderName}
      message={greeting.customMessage || greeting.generatedMessage || ""}
      templateId={greeting.templateId}
    />
  );
}
