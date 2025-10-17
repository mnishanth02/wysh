"use client";

/**
 * Relationship Selection Page
 * Second step in greeting creation flow
 */

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RelationshipSelector } from "@/components/forms/RelationshipSelector";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import type { FestivalType } from "@/types";

export default function RelationshipPage() {
  const router = useRouter();
  const [festival, setFestival] = useState<FestivalType | null>(null);

  useEffect(() => {
    const storedFestival = sessionStorage.getItem(
      "greeting_festival",
    ) as FestivalType;
    if (!storedFestival) {
      router.push("/create/festival");
      return;
    }
    setFestival(storedFestival);
  }, [router]);

  if (!festival) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 mobile-p-4 py-6 sm:py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-2 sm:mb-4 touch-target"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="text-center space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              Who Is This Greeting For?
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Select your relationship to personalize the greeting tone and
              style
            </p>
          </div>

          <RelationshipSelector />
        </div>
      </main>

      <Footer />
    </div>
  );
}
