"use client";

/**
 * Share Button Component
 * Generates WhatsApp deep link and handles sharing
 */

import { Button } from "@/components/ui/button";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

interface ShareButtonProps {
  shareableId: string;
}

export function ShareButton({ shareableId }: ShareButtonProps) {
  const handleWhatsAppShare = () => {
    const greetingUrl = `${window.location.origin}/g/${shareableId}`;
    const whatsappUrl = generateWhatsAppLink(greetingUrl);
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Button
      onClick={handleWhatsAppShare}
      className="h-auto py-4 bg-green-600 hover:bg-green-700"
    >
      <MessageCircle className="h-5 w-5 mr-2" />
      <div className="text-left">
        <div className="font-semibold">Share via WhatsApp</div>
        <div className="text-xs opacity-90">Instant share</div>
      </div>
    </Button>
  );
}
