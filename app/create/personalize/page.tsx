"use client";

/**
 * Personalization Page
 * Third step in greeting creation flow
 *
 * Note: Wrapped in Suspense boundary for nuqs (uses useSearchParams internally)
 */

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { Suspense, useEffect } from "react";
import { PersonalizationForm } from "@/components/forms/PersonalizationForm";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { greetingParsers } from "@/lib/url-state-parsers";

function PersonalizeContent() {
  const router = useRouter();
  const [{ festival, relationship }] = useQueryStates({
    festival: greetingParsers.festival,
    relationship: greetingParsers.relationship,
  });

  useEffect(() => {
    // Redirect to festival selection if required URL state is missing
    if (!festival || !relationship) {
      router.push("/create/festival");
    }
  }, [festival, relationship, router]);

  if (!festival || !relationship) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          Personalize Your Greeting
        </h1>
        <p className="text-lg text-muted-foreground">
          Add names and a custom message to make it special
        </p>
      </div>

      <PersonalizationForm />
    </div>
  );
}

export default function PersonalizePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        <Suspense fallback={<LoadingState message="Loading..." />}>
          <PersonalizeContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
