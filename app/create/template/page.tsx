"use client";

/**
 * Template Selection Page
 * Fourth step in greeting creation flow
 *
 * Note: Wrapped in Suspense boundary for nuqs (uses useSearchParams internally)
 */

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { Suspense, useEffect } from "react";
import { TemplateSelector } from "@/components/forms/TemplateSelector";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { isFestivalEnabled } from "@/lib/feature-flags";
import { greetingParsers } from "@/lib/url-state-parsers";

function TemplateContent() {
  const router = useRouter();
  const [urlState] = useQueryStates({
    festival: greetingParsers.festival,
    relationship: greetingParsers.relationship,
    recipientName: greetingParsers.recipientName,
    senderName: greetingParsers.senderName,
    customMessage: greetingParsers.customMessage,
  });

  const { festival, relationship, recipientName, senderName, customMessage } =
    urlState;

  useEffect(() => {
    // Redirect to festival selection if required URL state is missing
    if (!festival || !relationship || !recipientName || !senderName) {
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
  }, [festival, relationship, recipientName, senderName, router]);

  if (!festival || !relationship || !recipientName || !senderName) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="touch-target hover:bg-accent"
      >
        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
        <span className="text-sm sm:text-base">Back to Personalize</span>
      </Button>

      <div className="text-center space-y-3 sm:space-y-4 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          Choose Your Template
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Select a beautiful animated template for your greeting
        </p>
      </div>

      <div className="px-4">
        <TemplateSelector
          festival={festival}
          relationship={relationship}
          recipientName={recipientName}
          senderName={senderName}
          customMessage={customMessage || ""}
          enablePreview={true}
        />
      </div>
    </div>
  );
}

export default function TemplatePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1 mobile-p-4 py-6 sm:py-8 md:py-12">
        <Suspense fallback={<LoadingState message="Loading..." />}>
          <TemplateContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
