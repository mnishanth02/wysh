"use client";

/**
 * Relationship Selection Page
 * Second step in greeting creation flow
 *
 * Note: Wrapped in Suspense boundary for nuqs (uses useSearchParams internally)
 */

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { Suspense, useEffect } from "react";
import { RelationshipSelector } from "@/components/forms/RelationshipSelector";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { isFestivalEnabled } from "@/lib/feature-flags";
import { greetingParsers } from "@/lib/url-state-parsers";

function RelationshipContent() {
  const router = useRouter();
  const [festival] = useQueryState("festival", greetingParsers.festival);

  useEffect(() => {
    // Redirect to festival selection if festival is not set in URL
    if (!festival) {
      router.push("/create/festival");
      return;
    }

    // Redirect if festival is not enabled (backdoor protection)
    if (!isFestivalEnabled(festival)) {
      console.warn(
        `Attempted access to disabled festival: ${festival}. Redirecting to festival selection.`,
      );
      router.push("/create/festival");
    }
  }, [festival, router]);

  if (!festival) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
      <Button
        variant="ghost"
        onClick={ () => router.push("/create/festival") }
        className="mb-2 sm:mb-4 touch-target"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Festival
      </Button>

      <div className="text-center space-y-3 sm:space-y-4 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          Who Is This Greeting For?
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Select your relationship to personalize the greeting tone and style
        </p>
      </div>

      <RelationshipSelector />
    </div>
  );
}

export default function RelationshipPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 mobile-p-4 py-6 sm:py-8 md:py-12">
        <Suspense fallback={ <LoadingState message="Loading..." /> }>
          <RelationshipContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
