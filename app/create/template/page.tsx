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
    }
  }, [festival, relationship, recipientName, senderName, router]);

  if (!festival || !relationship || !recipientName || !senderName) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          Choose Your Template
        </h1>
        <p className="text-lg text-muted-foreground">
          Select a beautiful animated template for your greeting
        </p>
      </div>

      <TemplateSelector
        festival={festival}
        relationship={relationship}
        recipientName={recipientName}
        senderName={senderName}
        customMessage={customMessage || ""}
        enablePreview={true}
      />
    </div>
  );
}

export default function TemplatePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        <Suspense fallback={<LoadingState message="Loading..." />}>
          <TemplateContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
