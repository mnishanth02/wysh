"use client";

/**
 * Share Button Component
 * Generates WhatsApp deep link and handles sharing
 */

import { Button } from "@/components/ui/button";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";
import { buildGreetingUrl } from "@/lib/utils";

interface ShareButtonProps {
    shareableId: string;
}

export function ShareButton({ shareableId }: ShareButtonProps) {
    const handleWhatsAppShare = () => {
        const greetingUrl = buildGreetingUrl(shareableId);
        const whatsappUrl = generateWhatsAppLink(greetingUrl);
        window.open(whatsappUrl, "_blank");
    };

    return (
        <Button
            onClick={ handleWhatsAppShare }
            className="touch-target-lg h-auto py-3 sm:py-4 bg-green-600 hover:bg-green-700 active:scale-95 w-full sm:w-auto"
        >
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <div className="text-left">
                <div className="font-semibold text-sm sm:text-base">
                    Share via WhatsApp
                </div>
                <div className="text-xs opacity-90">Instant share</div>
            </div>
        </Button>
    );
}
