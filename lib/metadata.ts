// SEO Metadata Helper Functions
// Purpose: Generate SEO metadata for pages (title, description, Open Graph, Twitter Card)

import type { Metadata } from "next";

interface MetadataParams {
  title: string;
  description: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
}

const SITE_NAME = "Wysh";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wysh.app";
const DEFAULT_OG_IMAGE = "/og-default.png";

/**
 * Generate standard page metadata with Open Graph and Twitter Card tags
 */
export function generatePageMetadata({
  title,
  description,
  path = "",
  image = DEFAULT_OG_IMAGE,
  imageAlt,
  noIndex = false,
}: MetadataParams): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullImageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt || title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  };
}

/**
 * Generate metadata for greeting pages with personalized content
 */
export function generateGreetingMetadata({
  festivalType,
  senderName,
  recipientName,
  customMessage,
  shareableId,
}: {
  festivalType: string;
  senderName: string;
  recipientName?: string;
  customMessage?: string;
  shareableId: string;
}): Metadata {
  const title = recipientName
    ? `${festivalType} Greeting for ${recipientName} from ${senderName}`
    : `${festivalType} Greeting from ${senderName}`;

  const description = customMessage
    ? `"${customMessage.slice(0, 100)}${customMessage.length > 100 ? "..." : ""}" - ${senderName}`
    : `${senderName} sent you a personalized ${festivalType} greeting! Create your own beautiful festival greetings on Wysh.`;

  return generatePageMetadata({
    title,
    description,
    path: `/g/${shareableId}`,
    image: `/api/og?id=${shareableId}`,
    imageAlt: title,
    noIndex: true, // Don't index individual greetings (per spec)
  });
}

/**
 * Get title template for root layout
 */
export function getTitleTemplate(): string {
  return `%s | ${SITE_NAME}`;
}

/**
 * Get default title for root layout
 */
export function getDefaultTitle(): string {
  return `${SITE_NAME} - Create Beautiful Personalized Festival Greetings | Free`;
}

/**
 * Get default description for root layout
 */
export function getDefaultDescription(): string {
  return "Create stunning personalized festival greetings for Diwali, Holi, Christmas, Pongal, New Year and more. Share via WhatsApp in seconds. Free and no signup required.";
}

/**
 * Get default keywords for root layout
 */
export function getDefaultKeywords(): string[] {
  return [
    "festival greetings",
    "diwali cards",
    "holi wishes",
    "christmas greetings",
    "new year wishes",
    "pongal greetings",
    "whatsapp greetings",
    "personalized cards",
    "free greeting cards",
    "animated greetings",
  ];
}
