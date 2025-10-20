"use client";

/**
 * Template Selector Component
 * Displays available templates for the selected festival
 * Handles template selection and greeting creation
 * T097: Added animation preview capability with AnimationControls
 */

import { useMutation } from "convex/react";
import { Eye } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { GreetingRenderer } from "@/components/greetings/GreetingRenderer";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { FESTIVALS } from "@/lib/constants";
import { getRelationshipContext } from "@/lib/context-engine";
import type { FestivalType, RelationshipType } from "@/types";

interface TemplateSelectorProps {
  festival: FestivalType;
  relationship: RelationshipType;
  recipientName: string;
  senderName: string;
  customMessage: string;
  enablePreview?: boolean;
}

// Template configurations for each festival
const TEMPLATE_CONFIGS: Record<
  FestivalType,
  { id: string; name: string; description: string }[]
> = {
  diwali: [
    {
      id: "diwali-1",
      name: "Diya Lights",
      description: "Traditional diyas lighting sequence",
    },
    {
      id: "diwali-2",
      name: "Rangoli Bloom",
      description: "Colorful rangoli animation",
    },
    {
      id: "diwali-3",
      name: "Fireworks Joy",
      description: "Festive fireworks display",
    },
  ],
  holi: [
    {
      id: "holi-1",
      name: "Color Splash",
      description: "Vibrant color powder burst",
    },
    {
      id: "holi-2",
      name: "Water Balloons",
      description: "Playful water balloon animation",
    },
    {
      id: "holi-3",
      name: "Rainbow Wave",
      description: "Flowing rainbow colors",
    },
  ],
  christmas: [
    {
      id: "christmas-1",
      name: "Snow Globe",
      description: "Magical snow globe scene",
    },
    {
      id: "christmas-2",
      name: "Tree Lights",
      description: "Twinkling Christmas tree",
    },
    {
      id: "christmas-3",
      name: "Gift Unwrap",
      description: "Surprise gift reveal",
    },
  ],
  newyear: [
    {
      id: "newyear-1",
      name: "Countdown",
      description: "New Year countdown timer",
    },
    {
      id: "newyear-2",
      name: "Champagne Pop",
      description: "Celebratory champagne toast",
    },
    {
      id: "newyear-3",
      name: "Fireworks Sky",
      description: "Midnight fireworks spectacle",
    },
  ],
  pongal: [
    {
      id: "pongal-1",
      name: "Harvest Sun",
      description: "Rising sun with sugarcane",
    },
    {
      id: "pongal-2",
      name: "Boiling Pot",
      description: "Traditional Pongal pot",
    },
    {
      id: "pongal-3",
      name: "Kolam Art",
      description: "Beautiful kolam patterns",
    },
  ],
  generic: [
    {
      id: "generic-1",
      name: "Celebration",
      description: "General celebration theme",
    },
    {
      id: "generic-2",
      name: "Confetti Joy",
      description: "Colorful confetti burst",
    },
    // generic-3 is not in backend's allowed list, so remove it
  ],
};

// Template icon mappings - static SVG images for visual representation
const TEMPLATE_ICONS: Record<string, string> = {
  // Diwali templates
  "diwali-1": "/festivals/diwali/diya.svg",
  "diwali-2": "/festivals/diwali/rangoli-pattern.svg",
  "diwali-3": "/festivals/newyear/firework-base.svg",
  // Holi templates
  "holi-1": "/festivals/diwali/sparkle.svg",
  "holi-2": "/festivals/diwali/sparkle.svg",
  "holi-3": "/festivals/diwali/rangoli-pattern.svg",
  // Christmas templates
  "christmas-1": "/festivals/diwali/sparkle.svg",
  "christmas-2": "/festivals/diwali/sparkle.svg",
  "christmas-3": "/festivals/diwali/sparkle.svg",
  // New Year templates
  "newyear-1": "/festivals/newyear/firework-base.svg",
  "newyear-2": "/festivals/newyear/confetti-shapes.svg",
  "newyear-3": "/festivals/newyear/firework-base.svg",
  // Pongal templates
  "pongal-1": "/festivals/pongal/sun.svg",
  "pongal-2": "/festivals/pongal/pot.svg",
  "pongal-3": "/festivals/pongal/kolam.svg",
  // Generic templates
  "generic-1": "/festivals/newyear/confetti-shapes.svg",
  "generic-2": "/festivals/newyear/confetti-shapes.svg",
};

export function TemplateSelector({
  festival,
  relationship,
  recipientName,
  senderName,
  customMessage,
  enablePreview = false,
}: TemplateSelectorProps) {
  const router = useRouter();
  const createGreeting = useMutation(api.greetings.createGreeting);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const festivalData = FESTIVALS[festival];
  const templates = TEMPLATE_CONFIGS[festival] || [];
  const relationshipContext = getRelationshipContext(relationship);

  const handlePreview = (templateId: string) => {
    setPreviewTemplate(templateId);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewTemplate(null);
  };

  const handleTemplateSelect = async (templateId: string) => {
    setSelectedTemplate(templateId);
    setIsCreating(true);

    try {
      // Create greeting with exponential backoff retry logic
      const result = await createGreetingWithRetry({
        festivalType: festival,
        relationshipType: relationship,
        recipientName,
        senderName,
        customMessage: customMessage || undefined,
        templateId,
      });

      // Navigate to success page with shareableId in URL
      router.push(
        `/create/success?shareableId=${result.shareableId}&templateId=${templateId}`,
      );
    } catch (error) {
      console.error("Failed to create greeting:", error);

      // Check if this is a rate limit error
      if (error instanceof Error) {
        // ConvexError adds data property with code and retryAfter
        const errorData = error as Error & {
          data?: { code?: string; retryAfter?: number };
        };

        if (errorData.data?.code === "RATE_LIMIT_EXCEEDED") {
          // Rate limit error - show countdown timer
          const retryAfterSeconds = Math.ceil(
            (errorData.data.retryAfter || 60000) / 1000,
          );
          const minutes = Math.floor(retryAfterSeconds / 60);
          const seconds = retryAfterSeconds % 60;

          const timeMessage =
            minutes > 0
              ? `${minutes} minute${minutes > 1 ? "s" : ""} ${seconds > 0 ? `and ${seconds} second${seconds > 1 ? "s" : ""}` : ""}`
              : `${seconds} second${seconds > 1 ? "s" : ""}`;

          toast.error(
            `Too many greetings created. Please wait ${timeMessage} and try again.`,
            {
              duration: 5000,
            },
          );
        } else {
          // Generic error
          toast.error("Failed to create greeting. Please try again.");
        }
      } else {
        toast.error("Failed to create greeting. Please try again.");
      }

      setIsCreating(false);
      setSelectedTemplate(null);
    }
  };

  const createGreetingWithRetry = async (
    data: Parameters<typeof createGreeting>[0],
    attempt = 1,
  ): Promise<{ greetingId: unknown; shareableId: string }> => {
    const maxAttempts = 3;
    const delays = [0, 500, 1500]; // Exponential backoff

    try {
      return await createGreeting(data);
    } catch (error) {
      if (attempt < maxAttempts) {
        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
        return createGreetingWithRetry(data, attempt + 1);
      }
      throw error;
    }
  };

  if (isCreating) {
    return <LoadingState message="Creating your greeting..." />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Context Indicator - Redesigned */}
      <div className="text-center p-4 sm:p-5 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl border border-primary/20">
        <p className="text-sm sm:text-base text-foreground">
          Templates styled for{" "}
          <span className="font-bold text-primary">
            {relationshipContext.visualTone}
          </span>{" "}
          tone
        </p>
      </div>

      {/* Template Grid - Redesigned with larger cards */}
      <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template, index) => {
          // Use different color combinations for each template variant
          const colorIndex1 = index % festivalData.colorPalette.length;
          const colorIndex2 = (index + 1) % festivalData.colorPalette.length;
          const gradientAngle = 135 + index * 30; // Vary gradient angle

          return (
            <Card
              key={template.id}
              className="group gap-0 p-0 touch-target overflow-hidden border-2 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] rounded-3xl"
            >
              {/* Template Preview - Enlarged */}
              <div
                className="relative h-56 sm:h-64 flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-110"
                style={{
                  background: `linear-gradient(${gradientAngle}deg, ${festivalData.colorPalette[colorIndex1]}, ${festivalData.colorPalette[colorIndex2]})`,
                }}
              >
                {/* Template Icon/Visual - Static representation */}
                {TEMPLATE_ICONS[template.id] && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={TEMPLATE_ICONS[template.id]}
                      alt={template.name}
                      width={150}
                      height={150}
                      className="opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                    />
                  </div>
                )}

                {/* Gradient Overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                <div className="relative text-center text-white space-y-2 sm:space-y-3 p-4 sm:p-6 drop-shadow-lg">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
                    {recipientName}
                  </p>
                  <p className="text-sm sm:text-base md:text-lg opacity-90">
                    From {senderName}
                  </p>
                </div>
              </div>

              {/* Template Info - Improved spacing */}
              <div className="p-5 sm:p-6 space-y-3 sm:space-y-4 bg-card">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
                    {template.name}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {template.description}
                  </p>
                </div>

                {/* Action Buttons - Improved design */}
                <div className="flex gap-3 pt-2">
                  {enablePreview && (
                    <Button
                      variant="outline"
                      size="default"
                      className="flex-1 touch-target h-11 sm:h-12 text-sm sm:text-base font-medium"
                      onClick={() => handlePreview(template.id)}
                    >
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Preview
                    </Button>
                  )}
                  <Button
                    variant={enablePreview ? "default" : "default"}
                    size="default"
                    className={`${enablePreview ? "flex-1" : "w-full"} touch-target h-11 sm:h-12 text-sm sm:text-base font-semibold`}
                    disabled={selectedTemplate === template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    {selectedTemplate === template.id
                      ? "Creating..."
                      : "Select Template"}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Preview Dialog with Animation - Enhanced Design */}
      {enablePreview && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-5xl h-[90vh] p-0 flex flex-col overflow-hidden rounded-3xl">
            <DialogHeader className="p-4 sm:p-6 bg-background border-b shrink-0">
              <DialogTitle className="text-lg sm:text-xl font-bold">
                Preview Animation
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base text-muted-foreground">
                Watch the full animation before selecting this template
              </DialogDescription>
            </DialogHeader>

            {/* Responsive preview container with proper aspect ratio */}
            <div className="relative flex-1 min-h-0 w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
              {previewTemplate && (
                <GreetingRenderer
                  festivalType={festival}
                  relationshipType={relationship}
                  recipientName={recipientName}
                  senderName={senderName}
                  message={
                    customMessage || `Happy ${festivalData.displayName}!`
                  }
                  templateId={previewTemplate}
                  isPreview={true}
                />
              )}
            </div>

            <div className="p-4 sm:p-6 border-t bg-background shrink-0">
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={handleClosePreview}
                  size="default"
                  className="text-sm sm:text-base h-11 sm:h-12 px-6 font-medium"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    if (previewTemplate) {
                      handleClosePreview();
                      handleTemplateSelect(previewTemplate);
                    }
                  }}
                  size="default"
                  className="text-sm sm:text-base h-11 sm:h-12 px-6 font-semibold"
                >
                  Select This Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
