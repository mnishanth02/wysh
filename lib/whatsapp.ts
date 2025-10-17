/**
 * WhatsApp Integration: Wysh Festival Greeting Platform
 *
 * Helper functions for WhatsApp deep linking and sharing
 */

import type { FestivalType } from "@/types";
import { FESTIVAL_EMOJIS, FESTIVALS, WHATSAPP_CONFIG } from "./constants";
import { buildGreetingUrl } from "./utils";

// ============================================================================
// WhatsApp Deep Link Generation
// ============================================================================

/**
 * Generate WhatsApp deep link with pre-filled message
 *
 * @param shareableId - The greeting's shareable ID
 * @param festivalType - Festival type for contextual message (optional)
 * @param senderName - Sender's name for personalized message (optional)
 * @param phoneNumber - Optional phone number to share with (without country code or + symbol)
 * @returns WhatsApp deep link URL
 *
 * @example
 * generateWhatsAppLink("a7x9k2m1", "diwali", "Priya")
 * // Returns: "https://wa.me/?text=🪔%20I%20created..."
 *
 * generateWhatsAppLink("a7x9k2m1", "diwali", "Priya", "919876543210")
 * // Returns: "https://wa.me/919876543210?text=🪔%20I%20created..."
 */
export function generateWhatsAppLink(
  shareableId: string,
  festivalType?: FestivalType,
  senderName?: string,
  phoneNumber?: string,
): string {
  const greetingUrl = buildGreetingUrl(shareableId);
  const message = formatWhatsAppMessage(greetingUrl, festivalType, senderName);
  const encodedMessage = encodeURIComponent(message);

  if (phoneNumber) {
    // Direct message to specific number
    return `${WHATSAPP_CONFIG.BASE_URL}${phoneNumber}?text=${encodedMessage}`;
  }

  // Open WhatsApp with pre-filled message (user selects recipient)
  return `${WHATSAPP_CONFIG.BASE_URL}?text=${encodedMessage}`;
}

/**
 * Format message for WhatsApp sharing with contextual emoji and text
 *
 * @param greetingUrl - Full greeting URL
 * @param festivalType - Festival type for emoji selection (optional)
 * @param senderName - Sender's name for personalization (optional)
 * @returns Formatted message text
 */
function formatWhatsAppMessage(
  greetingUrl: string,
  festivalType?: FestivalType,
  senderName?: string,
): string {
  // Get festival-specific emoji or default
  const emoji = festivalType ? FESTIVAL_EMOJIS[festivalType] : "🎉";

  // Get festival display name for contextual message
  const festivalName = festivalType
    ? FESTIVALS[festivalType].displayName
    : "festival";

  // Format contextual message
  if (senderName) {
    return `${emoji} I created a special ${festivalName} greeting for you! Open it to see: ${greetingUrl}`;
  }

  // Fallback to generic message
  return `${emoji} Check out this personalized ${festivalName} greeting I created for you! ${greetingUrl}`;
}

// ============================================================================
// Platform Detection
// ============================================================================

/**
 * Check if WhatsApp is available on current platform
 *
 * @returns True if WhatsApp can be opened
 */
export function isWhatsAppAvailable(): boolean {
  if (typeof window === "undefined") {
    return false; // Server-side
  }

  // Check if mobile device
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

  // WhatsApp works best on mobile
  return isMobile;
}

/**
 * Get recommended sharing method
 *
 * @returns "whatsapp" | "copy" | "share"
 */
export function getRecommendedShareMethod(): "whatsapp" | "copy" | "share" {
  if (typeof window === "undefined") {
    return "copy";
  }

  // Mobile devices with WhatsApp
  if (isWhatsAppAvailable()) {
    return "whatsapp";
  }

  // Desktop with Web Share API
  if ("share" in navigator) {
    return "share";
  }

  // Fallback to copy
  return "copy";
}

// ============================================================================
// WhatsApp Opening
// ============================================================================

/**
 * Open WhatsApp with greeting share link
 *
 * @param shareableId - The greeting's shareable ID
 * @param festivalType - Festival type for contextual message (optional)
 * @param senderName - Sender's name for personalization (optional)
 * @param phoneNumber - Optional phone number
 */
export function openWhatsApp(
  shareableId: string,
  festivalType?: FestivalType,
  senderName?: string,
  phoneNumber?: string,
): void {
  const link = generateWhatsAppLink(
    shareableId,
    festivalType,
    senderName,
    phoneNumber,
  );

  if (typeof window !== "undefined") {
    window.open(link, "_blank");
  }
}

/**
 * Try to open WhatsApp, fallback to copy if not available
 *
 * @param shareableId - The greeting's shareable ID
 * @param festivalType - Festival type for contextual message (optional)
 * @param senderName - Sender's name for personalization (optional)
 * @param onFallback - Callback if WhatsApp not available
 */
export async function shareViaWhatsApp(
  shareableId: string,
  festivalType?: FestivalType,
  senderName?: string,
  onFallback?: () => void,
): Promise<void> {
  if (isWhatsAppAvailable()) {
    openWhatsApp(shareableId, festivalType, senderName);
  } else if (onFallback) {
    onFallback();
  } else {
    // Default fallback: copy to clipboard
    const url = buildGreetingUrl(shareableId);
    await copyToClipboard(url);
  }
}

// ============================================================================
// Clipboard Integration
// ============================================================================

/**
 * Copy text to clipboard
 *
 * @param text - Text to copy
 * @returns Promise resolving to success status
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined" || !navigator.clipboard) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

/**
 * Copy greeting URL to clipboard
 *
 * @param shareableId - The greeting's shareable ID
 * @returns Promise resolving to success status
 */
export async function copyGreetingLink(shareableId: string): Promise<boolean> {
  const url = buildGreetingUrl(shareableId);
  return copyToClipboard(url);
}

// ============================================================================
// Web Share API
// ============================================================================

/**
 * Share greeting using Web Share API (mobile browsers)
 *
 * @param shareableId - The greeting's shareable ID
 * @param title - Share title (optional)
 * @returns Promise resolving to success status
 */
export async function shareViaWebApi(
  shareableId: string,
  title = "Check out my festival greeting!",
): Promise<boolean> {
  if (typeof window === "undefined" || !navigator.share) {
    return false;
  }

  const url = buildGreetingUrl(shareableId);

  try {
    await navigator.share({
      title,
      text: WHATSAPP_CONFIG.SHARE_MESSAGE_TEMPLATE.replace("{{url}}", ""),
      url,
    });
    return true;
  } catch (error) {
    // User cancelled or error occurred
    console.error("Web Share API failed:", error);
    return false;
  }
}

// ============================================================================
// Message Formatting
// ============================================================================

/**
 * Format custom WhatsApp message
 *
 * @param shareableId - The greeting's shareable ID
 * @param customText - Custom message text
 * @returns WhatsApp deep link with custom message
 */
export function generateCustomWhatsAppMessage(
  shareableId: string,
  customText: string,
): string {
  const greetingUrl = buildGreetingUrl(shareableId);
  const message = `${customText} ${greetingUrl}`;
  const encodedMessage = encodeURIComponent(message);

  return `${WHATSAPP_CONFIG.BASE_URL}?text=${encodedMessage}`;
}

/**
 * Get shareable message text without URL
 *
 * @returns Message template text
 */
export function getShareMessageText(): string {
  return WHATSAPP_CONFIG.SHARE_MESSAGE_TEMPLATE.replace("{{url}}", "").trim();
}

// ============================================================================
// Analytics Helpers (Post-MVP)
// ============================================================================

/**
 * Track share method used
 *
 * @param method - Share method used
 * @param shareableId - The greeting's shareable ID
 */
export function trackShareMethod(
  method: "whatsapp" | "copy" | "share" | "other",
  shareableId: string,
): void {
  // Post-MVP: Send analytics event
  console.log(`Share method: ${method} for greeting: ${shareableId}`);
}

// ============================================================================
// Export All Functions
// ============================================================================

export const whatsapp = {
  generateLink: generateWhatsAppLink,
  isAvailable: isWhatsAppAvailable,
  open: openWhatsApp,
  share: shareViaWhatsApp,
  copyLink: copyGreetingLink,
  shareViaWebApi,
  getRecommendedMethod: getRecommendedShareMethod,
  formatCustomMessage: generateCustomWhatsAppMessage,
};
