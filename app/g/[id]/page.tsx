/**
 * Greeting View Page
 * Dynamic page that displays animated greeting based on shareable ID
 */

import type { Metadata } from "next";
import { FESTIVAL_EMOJIS, FESTIVALS } from "@/lib/constants";
import { fetchGreetingByShareableId } from "@/lib/convex-server";
import type { FestivalType } from "@/types";

interface GreetingPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: GreetingPageProps): Promise<Metadata> {
  const { id } = await params;
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wysh.app";

  try {
    // Fetch greeting data server-side
    const greeting = await fetchGreetingByShareableId(id);

    if (!greeting) {
      return {
        title: "Greeting Not Found | Wysh",
        description: "The greeting you're looking for doesn't exist.",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    // Get festival info
    const festivalType = greeting.festivalType as FestivalType;
    const festival = FESTIVALS[festivalType];
    const festivalEmoji = FESTIVAL_EMOJIS[festivalType];

    // Create dynamic title: "Happy [Festival] from [SenderName]"
    const title = `${festivalEmoji} Happy ${festival.displayName} from ${greeting.senderName}!`;

    // Create description from message or generate contextual one
    const message =
      greeting.customMessage ||
      greeting.generatedMessage ||
      `View this special ${festival.displayName} greeting created just for you!`;

    // Truncate message for description (max 160 chars for optimal SEO)
    const description =
      message.length > 157 ? `${message.substring(0, 157)}...` : message;

    // Generate OG image URL (will be created in next step)
    const ogImageUrl = `${SITE_URL}/g/${id}/opengraph-image`;

    return {
      title,
      description,
      robots: {
        index: false, // Don't index individual greetings (prevent duplicate content)
        follow: false,
      },
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/g/${id}`,
        siteName: "Wysh",
        type: "website",
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${festival.displayName} greeting from ${greeting.senderName} to ${greeting.recipientName}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImageUrl],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Fallback metadata
    return {
      title: "Festival Greeting | Wysh",
      description: "View your personalized festival greeting",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function GreetingPage({ params }: GreetingPageProps) {
  const { id } = await params;

  // Dynamically import the client component
  const { GreetingView } = await import("./GreetingView");

  return <GreetingView shareableId={id} />;
}
