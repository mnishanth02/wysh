"use client";

/**
 * Diwali Template Component - Enhanced
 * Animated greeting template for Diwali festival
 * Features: Diya lighting, fireworks, sparkles, rangoli drawing with GSAP timeline
 * Phase 3: User Story 1 - Diwali Festival Lighting Animation
 */

import { gsap } from "gsap";
import { memo, useEffect, useRef, useState } from "react";
import {
  getDeviceAnimationConfig,
  getMobileParticleCount,
} from "@/lib/animations";
import { FESTIVALS } from "@/lib/constants";
import {
  logPerformanceMetrics,
  shouldUseReducedMotion,
  startFPSMonitor,
} from "@/lib/performance";
import type { RelationshipContext } from "@/types";
import { DiyaLighting } from "./animations/diwali/DiyaLighting";
import { FireworkSystem } from "./animations/diwali/FireworkSystem";
import { RangoliDraw } from "./animations/diwali/RangoliDraw";
import { SparkleParticles } from "./animations/diwali/SparkleParticles";
import { useAnimationContext } from "./animations/shared/ContextAdapter";

interface DiwaliTemplateProps {
  recipientName: string;
  senderName: string;
  message: string;
  relationshipContext: RelationshipContext;
  onAnimationComplete?: () => void;
  variant?: string; // "1" = Diya Lights, "2" = Rangoli Bloom, "3" = Fireworks Joy
  isPreview?: boolean; // T151: Modal preview mode - use responsive sizing
}

function DiwaliTemplateComponent({
  recipientName,
  senderName,
  message,
  relationshipContext,
  onAnimationComplete,
  variant = "1", // Default to Diya Lights
  isPreview = false,
}: DiwaliTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [bgVisible, setBgVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<
    "intro" | "main" | "text" | "finale" | "complete"
  >("intro");

  const festivalData = FESTIVALS.diwali;
  const colors = festivalData.colorPalette;

  // T035: Integrate ContextAdapter for relationship-aware adjustments
  const animationConfig = useAnimationContext(
    "diwali",
    relationshipContext.relationshipType,
  );

  // T036: Check for reduced motion preference
  const useReducedMotion = shouldUseReducedMotion();

  // T107: Mobile optimization - detect device and reduce particles
  const deviceConfig = getDeviceAnimationConfig();
  const mobileParticleCount = (count: number) => getMobileParticleCount(count);

  useEffect(() => {
    if (!containerRef.current) return;

    // Start FPS monitoring for performance profiling
    const fpsMonitor =
      process.env.NODE_ENV === "development" ? startFPSMonitor() : null;

    const ctx = gsap.context(() => {
      // T034: Create master GSAP timeline with phases
      const tl = gsap.timeline({
        onComplete: () => {
          // Log performance metrics after animation completes
          if (fpsMonitor) {
            const metrics = fpsMonitor.stop();
            logPerformanceMetrics("DiwaliTemplate", metrics);
          }
          setAnimationPhase("complete");
          // T037: Wire onAnimationComplete callback
          onAnimationComplete?.();
        },
      });

      // T036: Prefers-reduced-motion: simple fade-in
      if (useReducedMotion) {
        setBgVisible(true);
        tl.set(
          [
            ".diwali-content",
            ".greeting-title",
            ".recipient-name",
            ".message-body",
            ".sender-name",
          ],
          {
            opacity: 1,
          },
        );
        setAnimationPhase("complete");
        tl.play();
        return;
      }

      // Set initial opacity for animated elements
      gsap.set(
        [
          ".diwali-content",
          ".greeting-title",
          ".recipient-name",
          ".message-body",
          ".sender-name",
        ],
        {
          opacity: 0,
        },
      );

      // Set initial transform states
      gsap.set(".greeting-title", {
        scale: 0.8,
      });

      gsap.set([".recipient-name", ".message-body", ".sender-name"], {
        y: 20,
      });

      // Phase 1 (0-2s): Background fade via React state + diya lighting
      setBgVisible(true);
      tl.call(() => setAnimationPhase("intro"), [], 0);

      // Phase 2 (2-6s): Fireworks + sparkles
      tl.call(() => setAnimationPhase("main"), [], 2);

      // Phase 3 (6-8s): Text reveal with character animations
      tl.call(() => setAnimationPhase("text"), [], 6);

      // Fade in content container first
      tl.to(
        ".diwali-content",
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        6,
      );

      // Text reveal animations (6-10s)
      tl.to(
        ".greeting-title",
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "back.out(1.5)",
        },
        6.5,
      );

      tl.to(
        ".recipient-name",
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        7,
      );

      tl.to(
        ".message-body",
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        },
        7.5,
      );

      tl.to(
        ".sender-name",
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        8.5,
      );

      // Phase 4 (9-10s): Finale with sparkle loop
      tl.call(() => setAnimationPhase("finale"), [], 9);

      timelineRef.current = tl;
    }, containerRef);

    return () => ctx.revert();
  }, [onAnimationComplete, useReducedMotion]);

  const defaultMessage =
    "May this Diwali bring light, prosperity, and joy to your life! Wishing you a festival filled with happiness and blessings.";

  // Template titles based on variant
  const getTemplateTitle = () => {
    switch (variant) {
      case "1":
        return "Happy Diwali!"; // Diya Lights - Traditional
      case "2":
        return "Happy Diwali!"; // Rangoli Bloom - Artistic
      case "3":
        return "Happy Diwali!"; // Fireworks Joy - Celebratory
      default:
        return "Happy Diwali!";
    }
  };

  return (
    <div
      ref={ containerRef }
      className="diwali-bg relative w-full h-full overflow-hidden"
      style={ {
        background: `linear-gradient(135deg, ${animationConfig.colors[2] || colors[2]}, ${animationConfig.colors[3] || colors[3]})`,
        opacity: bgVisible ? 1 : 0,
        transition: bgVisible ? "opacity 2s ease-out" : "none",
        minHeight: isPreview ? "auto" : "100vh",
      } }
    >
      {/* T151: Responsive content container for preview and full-screen modes */ }
      <div
        className={ `diwali-content absolute inset-0 flex items-center justify-center ${isPreview ? "p-4 sm:p-6" : "p-8"
          }` }
      >
        {/* Semi-transparent backdrop for better text readability */ }
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />

        <div className="max-w-2xl text-center space-y-4 sm:space-y-6 w-full relative z-10">
          <h1
            className={ `greeting-title font-bold ${isPreview
                ? "text-2xl sm:text-3xl md:text-4xl"
                : "text-4xl md:text-5xl lg:text-6xl"
              }` }
            style={ {
              color: "#FFFFFF",
              textShadow:
                "0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 107, 53, 0.5), 0 4px 12px rgba(0, 0, 0, 0.6)",
            } }
          >
            { getTemplateTitle() }
          </h1>
          <p
            className={ `recipient-name font-semibold ${isPreview
                ? "text-lg sm:text-2xl md:text-3xl"
                : "text-3xl md:text-4xl"
              }` }
            style={ {
              color: "#FFFFFF",
              textShadow:
                "0 2px 6px rgba(0, 0, 0, 0.7), 0 4px 10px rgba(0, 0, 0, 0.5)",
            } }
          >
            Dear { recipientName },
          </p>
          <p
            className={ `message-body leading-relaxed ${isPreview
                ? "text-sm sm:text-base md:text-lg"
                : "text-lg md:text-xl"
              }` }
            style={ {
              color: "#FFFFFF",
              textShadow:
                "0 1px 4px rgba(0, 0, 0, 0.8), 0 2px 8px rgba(0, 0, 0, 0.6)",
              padding: "0.75rem 1rem",
              backdropFilter: "blur(4px)",
            } }
          >
            { message || defaultMessage }
          </p>
          <p
            className={ `sender-name font-medium mt-6 sm:mt-8 ${isPreview ? "text-base sm:text-xl" : "text-xl md:text-2xl"
              }` }
            style={ {
              color: "#FFA500",
              textShadow:
                "0 2px 4px rgba(0, 0, 0, 0.9), 0 0 15px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 1)",
            } }
          >
            With love,
            <br />
            { senderName }
          </p>
        </div>
      </div>

      {/* Variant 1 (Diya Lights): Traditional diya lighting sequence */ }
      { !useReducedMotion && variant === "1" && animationPhase !== "intro" && (
        <>
          <DiyaLighting count={ 7 } duration={ 1.5 } delay={ 0.5 } stagger={ 0.3 } />
          { animationPhase === "main" && (
            <SparkleParticles
              count={ mobileParticleCount(40) }
              duration={ 4 }
              delay={ 0 }
            />
          ) }
        </>
      ) }

      {/* Variant 2 (Rangoli Bloom): Colorful rangoli animation */ }
      { !useReducedMotion && variant === "2" && animationPhase !== "intro" && (
        <>
          <div className="absolute inset-0 flex items-center justify-center opacity-90">
            <RangoliDraw duration={ 4 } delay={ 0 } />
          </div>
          { animationPhase === "main" && (
            <SparkleParticles
              count={ mobileParticleCount(50) }
              duration={ 4 }
              delay={ 0 }
            />
          ) }
          { animationPhase === "main" && (
            <DiyaLighting count={ 4 } duration={ 1 } delay={ 1 } stagger={ 0.4 } />
          ) }
        </>
      ) }

      {/* Variant 3 (Fireworks Joy): Festive fireworks display */ }
      { !useReducedMotion && variant === "3" && animationPhase !== "intro" && (
        <>
          { animationPhase === "main" && (
            <FireworkSystem
              burstCount={
                deviceConfig.isMobile
                  ? 3
                  : animationConfig.intensity === "low"
                    ? 5
                    : 7
              }
              particlesPerBurst={ mobileParticleCount(
                animationConfig.intensity === "low"
                  ? 50
                  : animationConfig.intensity === "high"
                    ? 80
                    : 65,
              ) }
              duration={ 4 }
              delay={ 0 }
              colors={ animationConfig.colors }
            />
          ) }
          { animationPhase === "main" && (
            <SparkleParticles
              count={ mobileParticleCount(60) }
              duration={ 4 }
              delay={ 0 }
            />
          ) }
          { animationPhase === "finale" && (
            <FireworkSystem
              burstCount={ deviceConfig.isMobile ? 2 : 3 }
              particlesPerBurst={ mobileParticleCount(40) }
              duration={ 2 }
              delay={ 0 }
              colors={ animationConfig.colors }
            />
          ) }
        </>
      ) }

      {/* Phase 4 (8-10s): Finale sparkles for all variants */ }
      { !useReducedMotion && animationPhase === "finale" && (
        <SparkleParticles
          count={ mobileParticleCount(20) }
          duration={ 2 }
          delay={ 0 }
        />
      ) }

      {/* CSS for fade-in animation */ }
      <style jsx>{ `
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// Memoized export to prevent unnecessary re-renders
// Custom comparator ignores function reference changes (onAnimationComplete)
export const DiwaliTemplate = memo(
  DiwaliTemplateComponent,
  (prevProps, nextProps) => {
    // Only re-render if critical props change
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
      // Ignore onAnimationComplete function reference changes
    );
  },
);

DiwaliTemplate.displayName = "DiwaliTemplate";
