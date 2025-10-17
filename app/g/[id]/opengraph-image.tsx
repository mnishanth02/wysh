/**
 * OpenGraph Image Route
 * Generates dynamic OG images for WhatsApp previews
 * Uses Next.js ImageResponse API
 */

import { ImageResponse } from "next/og";
import { FESTIVAL_EMOJIS, FESTIVALS } from "@/lib/constants";
import { fetchGreetingByShareableId } from "@/lib/convex-server";
import type { FestivalType } from "@/types";

export const runtime = "edge";
export const alt = "Festival Greeting";
export const size = {
  width: 800,
  height: 600,
};
export const contentType = "image/png";

interface OGImageProps {
  params: Promise<{ id: string }>;
}

export default async function Image({ params }: OGImageProps) {
  const { id } = await params;

  try {
    // Fetch greeting data
    const greeting = await fetchGreetingByShareableId(id);

    if (!greeting) {
      // Return fallback image for not found
      return new ImageResponse(
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1a1a1a",
            color: "white",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 20 }}>✨</div>
          <div style={{ fontSize: 36, fontWeight: "bold" }}>
            Wysh Festival Greetings
          </div>
          <div style={{ fontSize: 20, opacity: 0.7, marginTop: 10 }}>
            Create personalized festival greetings
          </div>
        </div>,
        {
          ...size,
        },
      );
    }

    // Get festival info
    const festivalType = greeting.festivalType as FestivalType;
    const festival = FESTIVALS[festivalType];
    const festivalEmoji = FESTIVAL_EMOJIS[festivalType];
    const primaryColor = festival.colorPalette[0];
    const secondaryColor = festival.colorPalette[1] || festival.colorPalette[0];

    // Create gradient background
    const gradientBg = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;

    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: gradientBg,
          color: "white",
          fontFamily: "sans-serif",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "40px",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "40px",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "60px",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            zIndex: 1,
            maxWidth: "680px",
          }}
        >
          {/* Festival emoji */}
          <div
            style={{
              fontSize: 120,
              marginBottom: 30,
              display: "flex",
            }}
          >
            {festivalEmoji}
          </div>

          {/* Festival name */}
          <div
            style={{
              fontSize: 48,
              fontWeight: "bold",
              marginBottom: 20,
              display: "flex",
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            Happy {festival.displayName}!
          </div>

          {/* Recipient name */}
          <div
            style={{
              fontSize: 36,
              marginBottom: 15,
              display: "flex",
              opacity: 0.95,
            }}
          >
            For {greeting.recipientName}
          </div>

          {/* From sender */}
          <div
            style={{
              fontSize: 24,
              display: "flex",
              opacity: 0.85,
            }}
          >
            From {greeting.senderName}
          </div>

          {/* Wysh branding */}
          <div
            style={{
              marginTop: 40,
              fontSize: 20,
              display: "flex",
              opacity: 0.7,
            }}
          >
            ✨ Created with Wysh
          </div>
        </div>
      </div>,
      {
        ...size,
      },
    );
  } catch (error) {
    console.error("Error generating OG image:", error);

    // Return error fallback image
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a1a",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 20 }}>⚠️</div>
        <div style={{ fontSize: 32 }}>Unable to load greeting</div>
      </div>,
      {
        ...size,
      },
    );
  }
}
