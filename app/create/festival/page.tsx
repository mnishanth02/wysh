"use client";

/**
 * Festival Selection Page
 * First step in greeting creation flow
 */

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { FestivalSelector } from "@/components/forms/FestivalSelector";

export default function FestivalPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Choose Your Festival
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the festival you want to create a greeting for
            </p>
          </div>

          <FestivalSelector />
        </div>
      </main>

      <Footer />
    </div>
  );
}
