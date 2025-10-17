/**
 * Greeting View Page
 * Dynamic page that displays animated greeting based on shareable ID
 */

import type { Metadata } from "next";

interface GreetingPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: GreetingPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Your Festival Greeting | Wysh`,
    description: "View your personalized festival greeting",
    openGraph: {
      title: "You've received a special festival greeting!",
      description: "Open to view your personalized animated greeting",
      url: `https://wysh.app/g/${id}`,
      siteName: "Wysh",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "You've received a special festival greeting!",
      description: "Open to view your personalized animated greeting",
    },
  };
}

export default async function GreetingPage({ params }: GreetingPageProps) {
  const { id } = await params;

  // Dynamically import the client component
  const { GreetingView } = await import("./GreetingView");

  return <GreetingView shareableId={id} />;
}
