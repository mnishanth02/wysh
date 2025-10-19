"use client";

/**
 * Festival Selection Page
 * First step in greeting creation flow
 *
 * Note: Wrapped in Suspense boundary for nuqs (uses useSearchParams internally)
 */

import { Suspense } from "react";
import { FestivalSelector } from "@/components/forms/FestivalSelector";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";
import { LoadingState } from "@/components/shared/LoadingState";

function FestivalContent() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
      <div className="text-center space-y-3 sm:space-y-4 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          Choose Your Festival
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Select the festival you want to create a greeting for
        </p>
      </div>

      <FestivalSelector />
    </div>
  );
}

export default function FestivalPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1 mobile-p-4 py-6 sm:py-8 md:py-12">
        <Suspense fallback={<LoadingState message="Loading..." />}>
          <FestivalContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
