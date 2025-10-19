"use client";

/**
 * Generic Template Component
 * Animated greeting template for general celebrations
 * Features: Star sparkle and confetti animation
 */

import { gsap } from "gsap";
import { memo, useEffect, useRef, useState } from "react";
import { FESTIVALS } from "@/lib/constants";
import { shouldUseReducedMotion } from "@/lib/performance";
import { generateUniqueKey } from "@/lib/utils";
import type { RelationshipContext } from "@/types";

interface GenericTemplateProps {
  recipientName: string;
  senderName: string;
  message: string;
  relationshipContext: RelationshipContext;
  onAnimationComplete?: () => void;
  variant?: string; // "1" = Celebration, "2" = Confetti Joy
  isPreview?: boolean; // T151: Modal preview mode - use responsive sizing
}

function GenericTemplateComponent({
  recipientName,
  senderName,
  message,
  relationshipContext,
  onAnimationComplete,
  variant = "1",
  isPreview = false,
}: GenericTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bgVisible, setBgVisible] = useState(false);

  const festivalData = FESTIVALS.generic;
  const colors = festivalData.colorPalette;

  // T135, T148: Apply context-aware animation duration
  const animationDuration =
    relationshipContext.animationSpeed === "slow"
      ? 8
      : relationshipContext.animationSpeed === "fast"
        ? 5
        : 6.5;

  // T135, T148: Apply context-aware color intensity
  const colorIntensity = relationshipContext.colorIntensity;
  const primaryColor =
    colorIntensity === "muted"
      ? "#8A7BC8" // Muted purple
      : colorIntensity === "vibrant"
        ? colors[0] // Vibrant purple
        : "#667EEA"; // Moderate purple

  // T121: Check for reduced motion preference
  const useReducedMotion = shouldUseReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onAnimationComplete?.();
        },
      });

      // T121: Prefers-reduced-motion: simple fade-in
      if (useReducedMotion) {
        setBgVisible(true);
        tl.set(
          [
            ".star",
            ".confetti",
            ".greeting-text",
            ".recipient-name",
            ".sender-name",
          ],
          {
            opacity: 1,
          },
        );
        tl.call(
          () => {
            onAnimationComplete?.();
          },
          [],
          1,
        );
        return;
      }

      // Trigger background fade via React state
      setBgVisible(true);

      // Stars twinkling - duration based on context
      tl.from(".star", {
        scale: 0,
        opacity: 0,
        duration: animationDuration * 0.12,
        stagger: 0.1,
        ease: "elastic.out(1, 0.5)",
      });

      // Confetti burst
      tl.from(
        ".confetti",
        {
          y: 50,
          opacity: 0,
          rotation: 0,
          duration: animationDuration * 0.15,
          stagger: 0.03,
          ease: "power2.out",
        },
        "-=0.8",
      );

      // Text animations
      tl.from(
        ".greeting-text",
        {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.5",
      );

      tl.from(
        ".recipient-name",
        {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.3",
      );

      tl.from(
        ".sender-name",
        {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.5",
      );

      // T121: Infinite star sparkle animation (outside main timeline so it doesn't block onComplete)
      gsap.to(".star", {
        scale: 1.2,
        opacity: 0.7,
        duration: 0.5,
        stagger: 0.1,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [onAnimationComplete, animationDuration, useReducedMotion]);

  return (
    <div
      ref={ containerRef }
      className="generic-bg relative flex items-center justify-center p-4 w-full h-full"
      style={ {
        background: `linear-gradient(135deg, ${primaryColor}, ${colors[1]})`,
        opacity: bgVisible ? 1 : 0,
        transition: bgVisible ? "opacity 1s ease-out" : "none",
        minHeight: isPreview ? "auto" : "100vh",
      } }
    >
      {/* Decorative elements */ }
      <div className="absolute inset-0 overflow-hidden">
        {/* Stars */ }
        { [...Array(12)].map((_, i) => (
          <div
            key={ `star-${generateUniqueKey()}` }
            className={ `star absolute opacity-0 ${isPreview ? "text-2xl" : "text-4xl"
              }` }
            style={ {
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              color: colors[i % colors.length],
            } }
          >
            ⭐
          </div>
        )) }

        {/* Confetti */ }
        { [...Array(25)].map((_, i) => (
          <div
            key={ `confetti-${generateUniqueKey()}` }
            className={ `confetti absolute rounded-sm opacity-0 ${isPreview ? "h-2 w-2" : "h-3 w-3"
              }` }
            style={ {
              backgroundColor: colors[i % colors.length],
              left: `${Math.random() * 100}%`,
              top: `${20 + Math.random() * 60}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            } }
          />
        )) }
      </div>

      {/* T151: Responsive content for preview and full-screen modes */ }
      <div
        className={ `relative z-10 max-w-2xl text-center w-full ${isPreview ? "space-y-4 sm:space-y-6" : "space-y-6"
          }` }
      >
        <h1
          className={ `greeting-text font-bold opacity-0 ${isPreview
              ? "text-2xl sm:text-3xl md:text-4xl"
              : "text-5xl sm:text-6xl md:text-7xl"
            }` }
          style={ {
            color: "#FFFFFF",
            textShadow:
              "0 3px 10px rgba(0, 0, 0, 0.9), 0 0 25px rgba(102, 126, 234, 0.6), 0 6px 15px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(0, 0, 0, 1)",
          } }
        >
          Celebrating You!
        </h1>

        <div className={ isPreview ? "space-y-3 sm:space-y-4" : "space-y-4" }>
          <p
            className={ `recipient-name font-semibold opacity-0 ${isPreview
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
            className={ `greeting-text leading-relaxed px-4 opacity-0 ${isPreview
                ? "text-sm sm:text-base md:text-lg"
                : "text-lg sm:text-xl"
              }` }
            style={ {
              color: "#FFFFFF",
              textShadow:
                "0 2px 6px rgba(0, 0, 0, 0.95), 0 3px 10px rgba(0, 0, 0, 0.8)",
              backgroundColor: "rgba(0, 0, 0, 0.25)",
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              backdropFilter: "blur(6px)",
            } }
          >
            { message || `Sending you warm wishes and lots of happiness!` }
          </p>

          <p
            className={ `sender-name font-medium opacity-0 ${isPreview
                ? "text-base sm:text-lg md:text-xl mt-4 sm:mt-6"
                : "text-xl sm:text-2xl mt-8"
              }` }
            style={ {
              color: "#F093FB",
              textShadow:
                "0 2px 8px rgba(0, 0, 0, 0.95), 0 0 20px rgba(0, 0, 0, 0.8), 0 4px 12px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 1)",
            } }
          >
            With love,
            <br />
            { senderName }
          </p>
        </div>
      </div>
    </div>
  );
}

// Memoized export to prevent unnecessary re-renders
export const GenericTemplate = memo(GenericTemplateComponent, (prevProps, nextProps) => {
  return (
    prevProps.recipientName === nextProps.recipientName &&
    prevProps.senderName === nextProps.senderName &&
    prevProps.message === nextProps.message &&
    prevProps.variant === nextProps.variant &&
    prevProps.isPreview === nextProps.isPreview &&
    prevProps.relationshipContext.colorIntensity === nextProps.relationshipContext.colorIntensity &&
    prevProps.relationshipContext.animationSpeed === nextProps.relationshipContext.animationSpeed
  );
});

GenericTemplate.displayName = "GenericTemplate";
