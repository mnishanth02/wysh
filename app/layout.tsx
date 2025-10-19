import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/common/providers";
import {
  getDefaultDescription,
  getDefaultKeywords,
  getDefaultTitle,
  getTitleTemplate,
} from "@/lib/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wysh.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: getDefaultTitle(),
    template: getTitleTemplate(),
  },
  description: getDefaultDescription(),
  keywords: getDefaultKeywords(),
  authors: [{ name: "Nishanth Murugan" }],
  creator: "Nishanth Murugan",
  publisher: "Nishanth Murugan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Wysh",
    title: getDefaultTitle(),
    description: getDefaultDescription(),
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Wysh - Create Beautiful Festival Greetings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: getDefaultTitle(),
    description: getDefaultDescription(),
    images: ["/og-default.png"],
    creator: "@wyshapp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Wysh",
        description: getDefaultDescription(),
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/create/festival?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Wysh",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/og-default.png`,
        },
        sameAs: [],
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <fals positive>
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
