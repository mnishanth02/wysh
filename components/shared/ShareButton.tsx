"use client";

/**
 * Share Button Component
 * Generates WhatsApp deep link and handles sharing with festival context
 */

import { Copy, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { buildGreetingUrl } from "@/lib/utils";
import { generateWhatsAppLink, isWhatsAppAvailable } from "@/lib/whatsapp";
import type { FestivalType } from "@/types";

interface ShareButtonProps {
  shareableId: string;
  festivalType?: FestivalType;
  senderName?: string;
}

export function ShareButton({
  shareableId,
  festivalType,
  senderName,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const whatsappAvailable = isWhatsAppAvailable();

  const handleWhatsAppShare = () => {
    const whatsappUrl = generateWhatsAppLink(
      shareableId,
      festivalType,
      senderName,
    );
    window.open(whatsappUrl, "_blank");
  };

  const handleCopyLink = async () => {
    const greetingUrl = buildGreetingUrl(shareableId);
    try {
      await navigator.clipboard.writeText(greetingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      <Button
        onClick={handleWhatsAppShare}
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

      {!whatsappAvailable && (
        <Button
          onClick={handleCopyLink}
          variant="outline"
          className="touch-target-lg h-auto py-3 sm:py-4 active:scale-95 w-full sm:w-auto"
        >
          <Copy className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          <div className="text-left">
            <div className="font-semibold text-sm sm:text-base">
              {copied ? "Link Copied!" : "Copy Link"}
            </div>
            <div className="text-xs opacity-90">
              {copied ? "Ready to share" : "Alternative share"}
            </div>
          </div>
        </Button>
      )}
    </div>
  );
}
