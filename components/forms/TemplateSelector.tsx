"use client";

/**
 * Template Selector Component
 * Displays available templates for the selected festival
 * Handles template selection and greeting creation
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/LoadingState";
import { FESTIVALS } from "@/lib/constants";
import { getRelationshipContext } from "@/lib/context-engine";
import type { FestivalType, RelationshipType } from "@/types";
import { toast } from "sonner";

interface TemplateSelectorProps {
    festival: FestivalType;
    relationship: RelationshipType;
    recipientName: string;
    senderName: string;
    customMessage: string;
}

// Template configurations for each festival
const TEMPLATE_CONFIGS: Record<
    FestivalType,
    { id: string; name: string; description: string }[]
> = {
    diwali: [
        {
            id: "diwali-template-1",
            name: "Diya Lights",
            description: "Traditional diyas lighting sequence",
        },
        {
            id: "diwali-template-2",
            name: "Rangoli Bloom",
            description: "Colorful rangoli animation",
        },
        {
            id: "diwali-template-3",
            name: "Fireworks Joy",
            description: "Festive fireworks display",
        },
    ],
    holi: [
        {
            id: "holi-template-1",
            name: "Color Splash",
            description: "Vibrant color powder burst",
        },
        {
            id: "holi-template-2",
            name: "Water Balloons",
            description: "Playful water balloon animation",
        },
        {
            id: "holi-template-3",
            name: "Rainbow Wave",
            description: "Flowing rainbow colors",
        },
    ],
    christmas: [
        {
            id: "christmas-template-1",
            name: "Snow Globe",
            description: "Magical snow globe scene",
        },
        {
            id: "christmas-template-2",
            name: "Tree Lights",
            description: "Twinkling Christmas tree",
        },
        {
            id: "christmas-template-3",
            name: "Gift Unwrap",
            description: "Surprise gift reveal",
        },
    ],
    newyear: [
        {
            id: "newyear-template-1",
            name: "Countdown",
            description: "New Year countdown timer",
        },
        {
            id: "newyear-template-2",
            name: "Champagne Pop",
            description: "Celebratory champagne toast",
        },
        {
            id: "newyear-template-3",
            name: "Fireworks Sky",
            description: "Midnight fireworks spectacle",
        },
    ],
    pongal: [
        {
            id: "pongal-template-1",
            name: "Harvest Sun",
            description: "Rising sun with sugarcane",
        },
        {
            id: "pongal-template-2",
            name: "Boiling Pot",
            description: "Traditional Pongal pot",
        },
        {
            id: "pongal-template-3",
            name: "Kolam Art",
            description: "Beautiful kolam patterns",
        },
    ],
    generic: [
        {
            id: "generic-template-1",
            name: "Celebration",
            description: "General celebration theme",
        },
        {
            id: "generic-template-2",
            name: "Confetti Joy",
            description: "Colorful confetti burst",
        },
        {
            id: "generic-template-3",
            name: "Star Sparkle",
            description: "Sparkling star animation",
        },
    ],
};

export function TemplateSelector({
    festival,
    relationship,
    recipientName,
    senderName,
    customMessage,
}: TemplateSelectorProps) {
    const router = useRouter();
    const createGreeting = useMutation(api.greetings.createGreeting);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const festivalData = FESTIVALS[festival];
    const templates = TEMPLATE_CONFIGS[festival] || [];
    const relationshipContext = getRelationshipContext(relationship);

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

            // Store the shareable ID
            sessionStorage.setItem("greeting_shareableId", result.shareableId);
            sessionStorage.setItem("greeting_templateId", templateId);

            // Navigate to success page
            router.push("/create/success");
        } catch (error) {
            console.error("Failed to create greeting:", error);
            toast.error("Failed to create greeting. Please try again.");
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
                { templates.map((template) => (
                    <Card
                        key={ template.id }
                        className="group touch-target cursor-pointer overflow-hidden border-2 transition-all hover:border-primary hover:shadow-lg active:scale-95"
                        onClick={ () => handleTemplateSelect(template.id) }
                    >
                        {/* Template Preview */ }
                        <div
                            className="h-32 sm:h-48 flex items-center justify-center transition-transform group-hover:scale-105"
                            style={ {
                                background: `linear-gradient(135deg, ${festivalData.colorPalette[0]}, ${festivalData.colorPalette[1]})`,
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
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-2 touch-target"
                                disabled={ selectedTemplate === template.id }
                            >
                                { selectedTemplate === template.id
                                    ? "Creating..."
                                    : "Select Template" }
                            </Button>
                        </div>
                    </Card>
                )) }
            </div>
        </div>
    );
}
