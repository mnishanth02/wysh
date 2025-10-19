"use client";

/**
 * Template Selector Component
 * Displays available templates for the selected festival
 * Handles template selection and greeting creation
 * T097: Added animation preview capability with AnimationControls
 */

import { useMutation } from "convex/react";
import { Eye } from "lucide-react";
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
    <div className="space-y-4 sm:space-y-6">
      {/* Context Indicator */ }
      <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Templates styled for{ " " }
          <span className="font-semibold">
            { relationshipContext.visualTone }
          </span>{ " " }
          tone
        </p>
      </div>

      {/* Template Grid */ }
      <div className="grid gap-4 mobile-gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        { templates.map((template, index) => {
          // Use different color combinations for each template variant
          const colorIndex1 = index % festivalData.colorPalette.length;
          const colorIndex2 = (index + 1) % festivalData.colorPalette.length;
          const gradientAngle = 135 + (index * 30); // Vary gradient angle

          return (
            <Card
              key={ template.id }
              className="group gap-2 p-0 touch-target overflow-hidden border-2 transition-all hover:border-primary hover:shadow-lg"
            >
              {/* Template Preview */ }
              <div
                className="h-40 sm:h-44 flex items-center justify-center transition-transform group-hover:scale-105"
                style={ {
                  background: `linear-gradient(${gradientAngle}deg, ${festivalData.colorPalette[colorIndex1]}, ${festivalData.colorPalette[colorIndex2]})`,
                } }
              >
                <div className="text-center text-white space-y-1 sm:space-y-2 p-3 sm:p-4">
                  <p className="text-lg sm:text-xl font-bold">{ recipientName }</p>
                  <p className="text-xs sm:text-sm opacity-90">
                    From { senderName }
                  </p>
                </div>
              </div>

              {/* Template Info */ }
              <div className="p-3 sm:p-4 space-y-2">
                <h3 className="text-base sm:text-lg font-semibold">
                  { template.name }
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  { template.description }
                </p>

                {/* Action Buttons */ }
                <div className="flex gap-4 mt-3">
                  { enablePreview && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 touch-target"
                      onClick={ () => handlePreview(template.id) }
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  ) }
                  <Button
                    variant={ enablePreview ? "default" : "outline" }
                    size="sm"
                    className={ `${enablePreview ? "flex-1" : "w-full"} touch-target` }
                    disabled={ selectedTemplate === template.id }
                    onClick={ () => handleTemplateSelect(template.id) }
                  >
                    { selectedTemplate === template.id
                      ? "Creating..."
                      : "Select Template" }
                  </Button>
                </div>
              </div>
            </Card>
          );
        }) }
      </div>

      {/* T151: Preview Dialog with Animation - Fixed responsive layout */ }
      { enablePreview && (
        <Dialog open={ isPreviewOpen } onOpenChange={ setIsPreviewOpen }>
          <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col overflow-hidden">
            <DialogHeader className="p-3 sm:p-4 bg-background border-b shrink-0">
              <DialogTitle className="text-base sm:text-lg">
                Preview Animation
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Watch the full animation before selecting this template
              </DialogDescription>
            </DialogHeader>

            {/* T151: Responsive preview container with proper aspect ratio */ }
            <div className="relative flex-1 min-h-0 w-full bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
              { previewTemplate && (
                <GreetingRenderer
                  festivalType={ festival }
                  relationshipType={ relationship }
                  recipientName={ recipientName }
                  senderName={ senderName }
                  message={
                    customMessage || `Happy ${festivalData.displayName}!`
                  }
                  templateId={ previewTemplate }
                  isPreview={ true }
                />
              ) }
            </div>

            <div className="p-3 sm:p-4 border-t bg-background shrink-0">
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={ handleClosePreview }
                  className="text-xs sm:text-sm"
                >
                  Close
                </Button>
                <Button
                  onClick={ () => {
                    if (previewTemplate) {
                      handleClosePreview();
                      handleTemplateSelect(previewTemplate);
                    }
                  } }
                  className="text-xs sm:text-sm"
                >
                  Select This Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) }
    </div>
  );
}
