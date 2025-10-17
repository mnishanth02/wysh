"use client";

/**
 * Relationship Selection Page
 * Second step in greeting creation flow
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { FestivalType } from "@/types";
import { RelationshipSelector } from "@/components/forms/RelationshipSelector";

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

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Who Is This Greeting For?
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
