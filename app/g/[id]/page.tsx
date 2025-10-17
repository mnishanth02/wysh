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

  try {
    // Fetch greeting data server-side
    const greeting = await fetchGreetingByShareableId(id);

    if (!greeting) {
      return {
        title: "Greeting Not Found | Wysh",
        description: "The greeting you're looking for doesn't exist.",
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
    const ogImageUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://wysh.app"}/g/${id}/opengraph-image`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${process.env.NEXT_PUBLIC_APP_URL || "https://wysh.app"}/g/${id}`,
        siteName: "Wysh",
        type: "website",
        images: [
          {
            url: ogImageUrl,
            width: 800,
            height: 600,
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
    };
  }
}

export default async function GreetingPage({ params }: GreetingPageProps) {
  const { id } = await params;

  // Dynamically import the client component
  const { GreetingView } = await import("./GreetingView");

  return <GreetingView shareableId={id} />;
}
