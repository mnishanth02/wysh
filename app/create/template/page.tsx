"use client";

/**
 * Template Selection Page
 * Fourth step in greeting creation flow
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { FestivalType, RelationshipType } from "@/types";
import { TemplateSelector } from "@/components/forms/TemplateSelector";

export default function TemplatePage() {
  const router = useRouter();
  const [festival, setFestival] = useState<FestivalType | null>(null);
  const [relationship, setRelationship] = useState<RelationshipType | null>(
    null,
  );
  const [recipientName, setRecipientName] = useState<string>("");
  const [senderName, setSenderName] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>("");

  useEffect(() => {
    const storedFestival = sessionStorage.getItem(
      "greeting_festival",
    ) as FestivalType;
    const storedRelationship = sessionStorage.getItem(
      "greeting_relationship",
    ) as RelationshipType;
    const storedRecipient = sessionStorage.getItem("greeting_recipientName");
    const storedSender = sessionStorage.getItem("greeting_senderName");
    const storedMessage = sessionStorage.getItem("greeting_customMessage");

    if (
      !storedFestival ||
      !storedRelationship ||
      !storedRecipient ||
      !storedSender
    ) {
      router.push("/create/festival");
      return;
    }

    setFestival(storedFestival);
    setRelationship(storedRelationship);
    setRecipientName(storedRecipient);
    setSenderName(storedSender);
    setCustomMessage(storedMessage || "");
  }, [router]);

  if (!festival || !relationship) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto space-y-8">
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
            customMessage={customMessage}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
