/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <false positive> */
"use client";

/**
 * Christmas Template Component with Multiple Variants
 * Animated greeting template for Christmas
 * Variants:
 * 1. Snow Globe - Magical snow globe scene with falling snowflakes
 * 2. Tree Lights - Twinkling Christmas tree lights
 * 3. Gift Unwrap - Surprise gift reveal animation
 */

import { gsap } from "gsap";
import { memo, useEffect, useRef, useState } from "react";
import { FESTIVALS } from "@/lib/constants";
import { shouldUseReducedMotion } from "@/lib/performance";
import { generateUniqueKey } from "@/lib/utils";
import type { RelationshipContext } from "@/types";

interface ChristmasTemplateProps {
  recipientName: string;
  senderName: string;
  message: string;
  relationshipContext: RelationshipContext;
  onAnimationComplete?: () => void;
  variant?: string; // "1" = Snow Globe, "2" = Tree Lights, "3" = Gift Unwrap
  isPreview?: boolean; // T151: Modal preview mode - use responsive sizing
}

/**
 * Variant 1: Snow Globe
 * Theme: Magical snow globe scene with falling snowflakes
 * Animation: Snowflakes falling, text fade-in
 * Best For: Family relationships (parents, relatives)
 */
const SnowGlobeVariant = ({
  containerRef,
  colors,
  primaryColor,
  secondaryColor,
  isPreview,
  useReducedMotion,
  animationDuration,
  onAnimationComplete,
  recipientName,
  senderName,
  message,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  colors: readonly string[];
  primaryColor: string;
  secondaryColor: string;
  isPreview: boolean;
  useReducedMotion: boolean;
  animationDuration: number;
  onAnimationComplete?: () => void;
  recipientName: string;
  senderName: string;
  message: string;
}) => {
  const [bgVisible, setBgVisible] = useState(useReducedMotion);

  // Full experience on all devices
  const snowflakeCount = 20;

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onAnimationComplete?.();
        },
      });

      if (useReducedMotion) {
        tl.set(
          [
            ".greeting-text",
            ".recipient-name",
            ".sender-name",
            ".snowflake",
            ".light",
          ],
          { opacity: 1 },
        );
        tl.call(() => onAnimationComplete?.(), [], 1);
        return;
      }

      setBgVisible(true);

      // Snowflakes falling
      tl.from(".snowflake", {
        y: -100,
        opacity: 0,
        duration: animationDuration * 0.3,
        stagger: 0.1,
        ease: "power1.in",
      });

      // Text animations
      tl.from(
        ".greeting-text",
        { y: 30, opacity: 0, duration: 1, ease: "power2.out" },
        "-=1",
      );

      tl.from(
        ".recipient-name",
        { y: 20, opacity: 0, duration: 0.8, ease: "power2.out" },
        "-=0.3",
      );

      tl.from(
        ".sender-name",
        { y: 20, opacity: 0, duration: 0.8, ease: "power2.out" },
        "-=0.5",
      );

      // Lights twinkling
      gsap.to(".light", {
        opacity: 0.4,
        duration: 0.5,
        stagger: 0.1,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef, animationDuration, useReducedMotion, onAnimationComplete]);

  return (
    <div
      ref={ containerRef }
      className="relative flex items-center justify-center p-4"
      style={ {
        background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`,
        opacity: bgVisible ? 1 : 0,
        transition: bgVisible ? "opacity 1s ease-out" : "none",
        width: "100%",
        height: "100%",
        minHeight: isPreview ? "auto" : "100vh",
      } }
    >
      {/* Snowflakes - T109: Reduced count on mobile */ }
      <div className="absolute inset-0 overflow-hidden">
        { [...Array(snowflakeCount)].map(() => (
          <div
            key={ `snow-${generateUniqueKey()}` }
            className={ `snowflake absolute text-white opacity-70 ${isPreview ? "text-lg" : "text-2xl"
              }` }
            style={ {
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            } }
          >
            ❄
          </div>
        )) }

        {/* Twinkling lights */ }
        { [...Array(15)].map(() => (
          <div
            key={ `light-${generateUniqueKey()}` }
            className={ `light absolute rounded-full ${isPreview ? "h-2 w-2" : "h-3 w-3"}` }
            style={ {
              backgroundColor: colors[2],
              left: `${Math.random() * 100}%`,
              top: `${10 + Math.random() * 5}%`,
              boxShadow: `0 0 15px ${colors[2]}`,
            } }
          />
        )) }
      </div>

      {/* Content */ }
      <div
        className={ `relative z-10 max-w-2xl text-center w-full ${isPreview ? "space-y-4 sm:space-y-6" : "space-y-6"
          }` }
      >
        <h1
          className={ `greeting-text font-bold ${isPreview
              ? "text-3xl sm:text-4xl md:text-5xl"
              : "text-5xl sm:text-6xl md:text-7xl"
            }` }
          style={ {
            color: "#FFFFFF",
            textShadow:
              "0 3px 10px rgba(0, 0, 0, 0.9), 0 0 25px rgba(196, 30, 58, 0.6), 0 6px 15px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(0, 0, 0, 1)",
          } }
        >
          Merry Christmas!
        </h1>

        <div className={ isPreview ? "space-y-3 sm:space-y-4" : "space-y-4" }>
          <p
            className={ `recipient-name font-semibold ${isPreview
                ? "text-xl sm:text-2xl md:text-3xl"
                : "text-3xl sm:text-4xl"
              }` }
            style={ {
              color: "#FFFFFF",
              textShadow:
                "0 2px 8px rgba(0, 0, 0, 0.9), 0 4px 12px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(0, 0, 0, 1)",
            } }
          >
            Dear { recipientName },
          </p>

          <p
            className={ `greeting-text leading-relaxed px-4 ${isPreview
                ? "text-sm sm:text-base md:text-lg"
                : "text-lg sm:text-xl"
              }` }
            style={ {
              color: "#FFFFFF",
              textShadow:
                "0 2px 6px rgba(0, 0, 0, 0.95), 0 3px 10px rgba(0, 0, 0, 0.6)",
              padding: "0.75rem 1rem",
              backdropFilter: "blur(6px)",
            } }
          >
            { message ||
              `Wishing you a magical Christmas filled with joy, peace, and love!` }
          </p>

          <p
            className={ `sender-name font-medium ${isPreview
                ? "text-base sm:text-lg md:text-xl mt-4 sm:mt-6"
                : "text-xl sm:text-2xl mt-8"
              }` }
            style={ {
              color: "#FFD700",
              textShadow:
                "0 2px 4px rgba(0, 0, 0, 0.95), 0 0 20px rgba(0, 0, 0, 0.8), 0 4px 8px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 1)",
            } }
          >
            With warm wishes,
            <br />
            { senderName }
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Variant 2: Tree Lights
 * Theme: Twinkling Christmas tree lights
 * Animation: Tree structure with sequentially lighting bulbs
 * Best For: Friends and colleagues
 */
const TreeLightsVariant = ({
  containerRef,
  colors,
  primaryColor,
  secondaryColor,
  isPreview,
  useReducedMotion,
  animationDuration,
  onAnimationComplete,
  recipientName,
  senderName,
  message,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  colors: readonly string[];
  primaryColor: string;
  secondaryColor: string;
  isPreview: boolean;
  useReducedMotion: boolean;
  animationDuration: number;
  onAnimationComplete?: () => void;
  recipientName: string;
  senderName: string;
  message: string;
}) => {
  const [bgVisible, setBgVisible] = useState(useReducedMotion);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onAnimationComplete?.();
        },
      });

      if (useReducedMotion) {
        tl.set(
          [".greeting-text", ".recipient-name", ".sender-name", ".tree-light"],
          { opacity: 1 },
        );
        tl.call(() => onAnimationComplete?.(), [], 1);
        return;
      }

      setBgVisible(true);

      // Tree lights lighting up sequentially
      tl.from(
        ".tree-light",
        {
          scale: 0.3,
          opacity: 0,
          duration: 0.3,
          stagger: 0.08,
          ease: "elastic.out(1, 0.3)",
        },
        0.2,
      );

      // Text animations
      tl.from(
        ".greeting-text",
        { y: 30, opacity: 0, duration: 1, ease: "power2.out" },
        "-=0.5",
      );

      tl.from(
        ".recipient-name",
        { y: 20, opacity: 0, duration: 0.8, ease: "power2.out" },
        "-=0.3",
      );

      tl.from(
        ".sender-name",
        { y: 20, opacity: 0, duration: 0.8, ease: "power2.out" },
        "-=0.5",
      );

      // Continuous light twinkling
      gsap.to(".tree-light", {
        opacity: 0.5,
        duration: 0.6,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: (i) => i * 0.05,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef, animationDuration, useReducedMotion, onAnimationComplete]);

  return (
    <div
      ref={ containerRef }
      className="relative flex items-center justify-center p-4"
      style={ {
        background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`,
        opacity: bgVisible ? 1 : 0,
        transition: bgVisible ? "opacity 1s ease-out" : "none",
        width: "100%",
        height: "100%",
        minHeight: isPreview ? "auto" : "100vh",
      } }
    >
      {/* Christmas Tree with Lights */ }
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
        <div className="relative" style={ { width: "200px", height: "300px" } }>
          {/* Tree shape */ }
          <div
            style={ {
              position: "absolute",
              top: "0",
              left: "50%",
              transform: "translateX(-50%)",
              width: "0",
              height: "0",
              borderLeft: "60px solid transparent",
              borderRight: "60px solid transparent",
              borderBottom: "100px solid rgba(10, 77, 46, 0.3)",
            } }
          />
          <div
            style={ {
              position: "absolute",
              top: "80px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "0",
              height: "0",
              borderLeft: "80px solid transparent",
              borderRight: "80px solid transparent",
              borderBottom: "120px solid rgba(10, 77, 46, 0.3)",
            } }
          />

          {/* Tree lights - distributed across tree */ }
          { [...Array(24)].map((_, i) => {
            const row = Math.floor(i / 4);
            const col = i % 4;
            const topPercent = 15 + row * 18;
            const leftPercent = 15 + col * 22 + Math.random() * 10;

            return (
              <div
                key={ `tree-light-${generateUniqueKey()}` }
                className="tree-light absolute rounded-full"
                style={ {
                  width: isPreview ? "8px" : "10px",
                  height: isPreview ? "8px" : "10px",
                  backgroundColor: colors[i % 3],
                  top: `${topPercent}%`,
                  left: `${leftPercent}%`,
                  boxShadow: `0 0 12px ${colors[i % 3]}, inset 0 0 8px rgba(255,255,255,0.4)`,
                } }
              />
            );
          }) }

          {/* Tree trunk */ }
          <div
            style={ {
              position: "absolute",
              bottom: "-40px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "20px",
              height: "40px",
              backgroundColor: "#8B4513",
              borderRadius: "2px",
            } }
          />
        </div>
      </div>

      {/* Content */ }
      <div
        className={ `relative z-10 max-w-2xl text-center w-full ${isPreview ? "space-y-4 sm:space-y-6" : "space-y-6"
          }` }
      >
        <h1
          className={ `greeting-text font-bold ${isPreview
              ? "text-3xl sm:text-4xl md:text-5xl"
              : "text-5xl sm:text-6xl md:text-7xl"
            }` }
          style={ {
            color: "#FFFFFF",
            textShadow:
              "0 3px 10px rgba(0, 0, 0, 0.9), 0 0 25px rgba(196, 30, 58, 0.6), 0 6px 15px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(0, 0, 0, 1)",
          } }
        >
          Merry Christmas!
        </h1>

        <div className={ isPreview ? "space-y-3 sm:space-y-4" : "space-y-4" }>
          <p
            className={ `recipient-name font-semibold ${isPreview
                ? "text-xl sm:text-2xl md:text-3xl"
                : "text-3xl sm:text-4xl"
              }` }
            style={ {
              color: "#FFFFFF",
              textShadow:
                "0 2px 8px rgba(0, 0, 0, 0.9), 0 4px 12px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(0, 0, 0, 1)",
            } }
          >
            Dear { recipientName },
          </p>

          <p
            className={ `greeting-text leading-relaxed px-4 ${isPreview
                ? "text-sm sm:text-base md:text-lg"
                : "text-lg sm:text-xl"
              }` }
            style={ {
              color: "#FFFFFF",
              textShadow:
                "0 2px 6px rgba(0, 0, 0, 0.95), 0 3px 10px rgba(0, 0, 0, 0.6)",
              padding: "0.75rem 1rem",
              backdropFilter: "blur(6px)",
            } }
          >
            { message ||
              `Wishing you a magical Christmas filled with joy, peace, and love!` }
          </p>

          <p
            className={ `sender-name font-medium ${isPreview
                ? "text-base sm:text-lg md:text-xl mt-4 sm:mt-6"
                : "text-xl sm:text-2xl mt-8"
              }` }
            style={ {
              color: "#FFD700",
              textShadow:
                "0 2px 4px rgba(0, 0, 0, 0.95), 0 0 20px rgba(0, 0, 0, 0.8), 0 4px 8px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 1)",
            } }
          >
            With warm wishes,
            <br />
            { senderName }
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Variant 3: Gift Unwrap
 * Theme: Surprise gift reveal animation
 * Animation: Gift box opening with reveal effect
 * Best For: Romantic relationships and close friends
 */
const GiftUnwrapVariant = ({
  containerRef,
  colors,
  primaryColor,
  secondaryColor,
  isPreview,
  useReducedMotion,
  animationDuration,
  onAnimationComplete,
  recipientName,
  senderName,
  message,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  colors: readonly string[];
  primaryColor: string;
  secondaryColor: string;
  isPreview: boolean;
  useReducedMotion: boolean;
  animationDuration: number;
  onAnimationComplete?: () => void;
  recipientName: string;
  senderName: string;
  message: string;
}) => {
  const [bgVisible, setBgVisible] = useState(useReducedMotion);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onAnimationComplete?.();
        },
      });

      if (useReducedMotion) {
        tl.set(
          [
            ".greeting-text",
            ".recipient-name",
            ".sender-name",
            ".gift-lid",
            ".gift-box",
            ".confetti",
          ],
          { opacity: 1 },
        );
        tl.call(() => onAnimationComplete?.(), [], 1);
        return;
      }

      setBgVisible(true);

      // Gift lid opens
      tl.to(
        ".gift-lid",
        {
          rotationX: 90,
          y: -60,
          duration: 1.2,
          ease: "elastic.out(1, 0.5)",
        },
        0,
      );

      // Confetti burst
      tl.from(
        ".confetti",
        {
          y: 20,
          x: (i) => (i % 2 === 0 ? -30 : 30),
          opacity: 0,
          scale: 0,
          duration: 1,
          stagger: 0.05,
          ease: "back.out(1.7)",
        },
        0.2,
      );

      // Text animations
      tl.from(
        ".greeting-text",
        { y: 30, opacity: 0, duration: 1, ease: "power2.out" },
        0.5,
      );

      tl.from(
        ".recipient-name",
        { y: 20, opacity: 0, duration: 0.8, ease: "power2.out" },
        "-=0.3",
      );

      tl.from(
        ".sender-name",
        { y: 20, opacity: 0, duration: 0.8, ease: "power2.out" },
        "-=0.5",
      );

      // Floating confetti animation
      gsap.to(".confetti", {
        y: -Math.random() * 100 - 50,
        opacity: 0,
        duration: 2,
        delay: 1.2,
        stagger: 0.03,
        ease: "sine.in",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef, animationDuration, useReducedMotion, onAnimationComplete]);

  return (
    <div
      ref={ containerRef }
      className="relative flex items-center justify-center p-4"
      style={ {
        background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`,
        opacity: bgVisible ? 1 : 0,
        transition: bgVisible ? "opacity 1s ease-out" : "none",
        width: "100%",
        height: "100%",
        minHeight: isPreview ? "auto" : "100vh",
        perspective: "1000px",
      } }
    >
      {/* Gift Box Animation */ }
      <div className="absolute inset-0 overflow-hidden flex items-start justify-center pt-12 sm:pt-20">
        <div
          style={ {
            perspective: "1000px",
            width: isPreview ? "80px" : "120px",
            height: isPreview ? "80px" : "120px",
          } }
        >
          {/* Gift Box */ }
          <div
            className="gift-box relative"
            style={ {
              width: "100%",
              height: "100%",
              backgroundColor: colors[0],
              borderRadius: "8px",
              boxShadow: `0 8px 24px rgba(0,0,0,0.3), inset 0 0 0 3px ${colors[1]}`,
            } }
          >
            {/* Gift Ribbon */ }
            <div
              style={ {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              } }
            >
              <div
                style={ {
                  width: "30%",
                  height: "100%",
                  backgroundColor: colors[1],
                  opacity: 0.8,
                } }
              />
              <div
                style={ {
                  width: "100%",
                  height: "30%",
                  backgroundColor: colors[1],
                  opacity: 0.8,
                  position: "absolute",
                } }
              />
              <div
                style={ {
                  width: "20px",
                  height: "20px",
                  backgroundColor: colors[2],
                  borderRadius: "50%",
                  zIndex: 2,
                } }
              />
            </div>

            {/* Gift Lid */ }
            <div
              className="gift-lid absolute top-0 left-0 right-0"
              style={ {
                height: "50%",
                backgroundColor: colors[0],
                borderRadius: "8px 8px 0 0",
                boxShadow: `inset 0 0 0 3px ${colors[1]}`,
                transformOrigin: "bottom center",
                transformStyle: "preserve-3d",
              } }
            />
          </div>
        </div>

        {/* Confetti Particles */ }
        { [...Array(20)].map((_, idx) => (
          <div
            key={ `confetti-${generateUniqueKey()}` }
            className="confetti absolute"
            style={ {
              width: isPreview ? "6px" : "8px",
              height: isPreview ? "6px" : "8px",
              backgroundColor: colors[idx % 3],
              top: "50%",
              left: "50%",
              borderRadius: "2px",
            } }
          />
        )) }
      </div>

      {/* Content */ }
      <div
        className={ `relative z-10 max-w-2xl text-center w-full ${isPreview ? "space-y-4 sm:space-y-6" : "space-y-6"
          }` }
      >
        <h1
          className={ `greeting-text font-bold ${isPreview
              ? "text-3xl sm:text-4xl md:text-5xl"
              : "text-5xl sm:text-6xl md:text-7xl"
            }` }
          style={ {
            color: "#FFFFFF",
            textShadow:
              "0 3px 10px rgba(0, 0, 0, 0.9), 0 0 25px rgba(196, 30, 58, 0.6), 0 6px 15px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(0, 0, 0, 1)",
          } }
        >
          Merry Christmas!
        </h1>

        <div className={ isPreview ? "space-y-3 sm:space-y-4" : "space-y-4" }>
          <p
            className={ `recipient-name font-semibold ${isPreview
                ? "text-xl sm:text-2xl md:text-3xl"
                : "text-3xl sm:text-4xl"
              }` }
            style={ {
              color: "#FFFFFF",
              textShadow:
                "0 2px 8px rgba(0, 0, 0, 0.9), 0 4px 12px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(0, 0, 0, 1)",
            } }
          >
            Dear { recipientName },
          </p>

          <p
            className={ `greeting-text leading-relaxed px-4 ${isPreview
                ? "text-sm sm:text-base md:text-lg"
                : "text-lg sm:text-xl"
              }` }
            style={ {
              color: "#FFFFFF",
              textShadow:
                "0 2px 6px rgba(0, 0, 0, 0.95), 0 3px 10px rgba(0, 0, 0, 0.6)",
              padding: "0.75rem 1rem",
              backdropFilter: "blur(6px)",
            } }
          >
            { message ||
              `Wishing you a magical Christmas filled with joy, peace, and love!` }
          </p>

          <p
            className={ `sender-name font-medium ${isPreview
                ? "text-base sm:text-lg md:text-xl mt-4 sm:mt-6"
                : "text-xl sm:text-2xl mt-8"
              }` }
            style={ {
              color: "#FFD700",
              textShadow:
                "0 2px 4px rgba(0, 0, 0, 0.95), 0 0 20px rgba(0, 0, 0, 0.8), 0 4px 8px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 1)",
            } }
          >
            With warm wishes,
            <br />
            { senderName }
          </p>
        </div>
      </div>
    </div>
  );
};

function ChristmasTemplateComponent({
  recipientName,
  senderName,
  message,
  relationshipContext,
  onAnimationComplete,
  variant = "1",
  isPreview = false,
}: ChristmasTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const festivalData = FESTIVALS.christmas;
  const colors = festivalData.colorPalette;

  // T134, T145: Apply context-aware animation duration
  const animationDuration =
    relationshipContext.animationSpeed === "slow"
      ? 8
      : relationshipContext.animationSpeed === "fast"
        ? 5
        : 6.5;

  // T135, T145: Apply context-aware color intensity
  const colorIntensity = relationshipContext.colorIntensity;
  const primaryColor =
    colorIntensity === "muted"
      ? "#8B2635" // Muted red
      : colorIntensity === "vibrant"
        ? colors[0] // Vibrant red
        : "#C41E3A"; // Moderate red

  const secondaryColor =
    colorIntensity === "muted"
      ? "#0A4D2E" // Muted green
      : colorIntensity === "vibrant"
        ? colors[1] // Vibrant green
        : "#0C6B2E"; // Moderate green

  // T121: Check for reduced motion preference
  const useReducedMotion = shouldUseReducedMotion();

  const commonProps = {
    containerRef,
    colors,
    primaryColor,
    secondaryColor,
    isPreview,
    useReducedMotion,
    animationDuration,
    onAnimationComplete,
    recipientName,
    senderName,
    message,
  };

  // Render appropriate variant
  switch (variant) {
    case "1":
      return <SnowGlobeVariant { ...commonProps } />;
    case "2":
      return <TreeLightsVariant { ...commonProps } />;
    case "3":
      return <GiftUnwrapVariant { ...commonProps } />;
    default:
      return <SnowGlobeVariant { ...commonProps } />;
  }
}

// Memoized export to prevent unnecessary re-renders
export const ChristmasTemplate = memo(
  ChristmasTemplateComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.recipientName === nextProps.recipientName &&
      prevProps.senderName === nextProps.senderName &&
      prevProps.message === nextProps.message &&
      prevProps.variant === nextProps.variant &&
      prevProps.isPreview === nextProps.isPreview &&
      prevProps.relationshipContext.colorIntensity ===
      nextProps.relationshipContext.colorIntensity &&
      prevProps.relationshipContext.animationSpeed ===
      nextProps.relationshipContext.animationSpeed
    );
  },
);

ChristmasTemplate.displayName = "ChristmasTemplate";
