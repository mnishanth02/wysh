import type { MetadataRoute } from "next";

/**
 * Robots.txt for Wysh
 * Controls search engine crawler access
 */
export default function robots(): MetadataRoute.Robots {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wysh.zealer.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/create/*"],
        disallow: [
          "/api/*", // Disallow all API routes
          "/g/*", // Disallow individual greeting pages (prevent duplicate content, greetings are noindex)
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
