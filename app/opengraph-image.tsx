import { ImageResponse } from "next/og";

/**
 * Static Open Graph image for homepage
 * Generates a 1200x630 image with Wysh branding
 */
export const runtime = "edge";

export const alt = "Wysh - Create Beautiful Festival Greetings";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 120,
          fontWeight: "bold",
          color: "white",
          marginBottom: 20,
        }}
      >
        ✨ Wysh
      </div>
      <div
        style={{
          fontSize: 48,
          color: "rgba(255, 255, 255, 0.9)",
          textAlign: "center",
          maxWidth: "80%",
        }}
      >
        Create Beautiful Festival Greetings
      </div>
      <div
        style={{
          fontSize: 32,
          color: "rgba(255, 255, 255, 0.7)",
          marginTop: 30,
        }}
      >
        🎉 Diwali • 🎨 Holi • 🎄 Christmas • 🌾 Pongal • 🎆 New Year
      </div>
    </div>,
    {
      ...size,
    },
  );
}
