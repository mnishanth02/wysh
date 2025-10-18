"use client";

/**
 * Pongal Template Component
 * Enhanced animated greeting template for Pongal harvest festival
 *
 * Features complete animation sequence:
 * - Sunrise with rotating rays (0-2s)
 * - Kolam drawing animation (2-4s)
 * - Pongal pot boiling and overflow (3-6s)
 * - Steam particles rising (4-10s)
 * - Sugarcane sway and rice grains (4-10s)
 * - Text reveal sequence (6-10s)
 *
 * Tasks: T074-T081
 */

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { FESTIVALS } from "@/lib/constants";
import { shouldUseReducedMotion } from "@/lib/performance";
import type { RelationshipContext } from "@/types";
import { KolamDrawing } from "./animations/pongal/KolamDrawing";
import { PongalPot } from "./animations/pongal/PongalPot";
import { RiceGrains } from "./animations/pongal/RiceGrains";
import { SteamParticles } from "./animations/pongal/SteamParticles";
import { SugarcaneSway } from "./animations/pongal/SugarcaneSway";
import { SunRise } from "./animations/pongal/SunRise";
import { useAnimationContext } from "./animations/shared/ContextAdapter";

interface PongalTemplateProps {
  recipientName: string;
  senderName: string;
  message: string;
  /** T077: Relationship context for future context-aware adjustments */
  relationshipContext?: RelationshipContext;
  onAnimationComplete?: () => void;
  variant?: string; // "1" = Harvest Sun, "2" = Boiling Pot, "3" = Kolam Art
  isPreview?: boolean; // T151: Modal preview mode - use responsive sizing
}

type AnimationPhase =
  | "sunrise"
  | "kolam"
  | "pot"
  | "celebration"
  | "text"
  | "complete";

export function PongalTemplate({
  recipientName,
  senderName,
  message,
  relationshipContext,
  onAnimationComplete,
  variant = "1",
  isPreview = false,
}: PongalTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationPhase, setAnimationPhase] =
    useState<AnimationPhase>("sunrise");
  const [bgVisible, setBgVisible] = useState(false);
  const reducedMotion = shouldUseReducedMotion();

  const festivalData = FESTIVALS.pongal;
  const colors = festivalData.colorPalette;

  // T088: Get relationship-aware animation configuration
  const animationConfig = useAnimationContext(
    "pongal",
    relationshipContext?.relationshipType || "friend",
    65, // Base particle count for steam/rice
  );

  // Apply relationship-adjusted colors if available
  const adjustedColors = relationshipContext ? animationConfig.colors : colors;

  // Master timeline orchestration (T074, T075)
  useEffect(() => {
    if (!containerRef.current) return;

    // Reduced motion fallback (T078)
    if (reducedMotion) {
      setBgVisible(true);
      setAnimationPhase("complete");
      onAnimationComplete?.();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setAnimationPhase("complete");
          onAnimationComplete?.();
        },
      });

      // T076: Trigger background fade via React state
      setBgVisible(true);

      // Phase callbacks for conditional rendering
      tl.call(() => setAnimationPhase("sunrise"), [], 0);
      tl.addLabel("sunriseComplete", 2);

      tl.call(() => setAnimationPhase("kolam"), [], "sunriseComplete");
      tl.addLabel("kolamComplete", 4);

      tl.call(() => setAnimationPhase("pot"), [], 3);
      tl.addLabel("potBoiling", 6);

      tl.call(() => setAnimationPhase("celebration"), [], 4);

      // T080: Text reveal sequence (6-10s)
      tl.call(() => setAnimationPhase("text"), [], 6);

      // Greeting text "Happy Pongal" (6-7s)
      tl.from(
        ".greeting-text",
        {
          y: 50,
          opacity: 0,
          scale: 0.8,
          duration: 1,
          ease: "back.out(1.5)",
        },
        6,
      );

      // Recipient name (7-8s)
      tl.from(
        ".recipient-name",
        {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        7,
      );

      // Message body (8-9s)
      tl.from(
        ".message-body",
        {
          y: 20,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        8,
      );

      // Sender name (9-10s)
      tl.from(
        ".sender-name",
        {
          y: 20,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        9,
      );
    }, containerRef);

    return () => ctx.revert();
  }, [onAnimationComplete, reducedMotion]);

  // Reduced motion fallback (T078, T151: responsive)
  if (reducedMotion) {
    return (
      <div
        ref={ containerRef }
        className="pongal-bg relative flex items-center justify-center p-4 w-full h-full"
        style={ {
          background: `linear-gradient(to bottom, ${adjustedColors[0]}, ${adjustedColors[1]})`,
          minHeight: isPreview ? "auto" : "100vh",
        } }
      >
        <div
          className={ `relative z-10 max-w-2xl text-center w-full ${isPreview ? "space-y-4 sm:space-y-6" : "space-y-6"
            }` }
        >
          <h1
            className={ `font-bold drop-shadow-lg ${isPreview
                ? "text-2xl sm:text-3xl md:text-4xl"
                : "text-5xl sm:text-6xl md:text-7xl"
              }` }
            style={ { color: adjustedColors[2] } }
          >
            Pongal Vazhthukkal!
          </h1>

          <div className={ isPreview ? "space-y-3 sm:space-y-4" : "space-y-4" }>
            <p
              className={ `font-semibold drop-shadow-md ${isPreview
                  ? "text-lg sm:text-2xl md:text-3xl"
                  : "text-3xl sm:text-4xl"
                }` }
              style={ { color: adjustedColors[3] } }
            >
              Dear { recipientName },
            </p>

            <p
              className={ `leading-relaxed px-4 drop-shadow-md text-white ${isPreview
                  ? "text-sm sm:text-base md:text-lg"
                  : "text-lg sm:text-xl"
                }` }
            >
              { message ||
                `May this harvest festival bring abundant prosperity and happiness to you and your family!` }
            </p>

            <p
              className={ `font-medium drop-shadow-md ${isPreview
                  ? "text-base sm:text-lg md:text-xl mt-4 sm:mt-6"
                  : "text-xl sm:text-2xl mt-8"
                }` }
              style={ { color: adjustedColors[0] } }
            >
              With best wishes,
              <br />
              { senderName }
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ containerRef }
      className="pongal-bg relative flex items-center justify-center p-4 overflow-hidden w-full h-full"
      style={ {
        background: `linear-gradient(to bottom, ${adjustedColors[0]}, ${adjustedColors[1]})`,
        opacity: bgVisible ? 1 : 0,
        transition: bgVisible ? "opacity 2s ease-out" : "none",
        minHeight: isPreview ? "auto" : "100vh",
      } }
    >
      {/* Animation Layers */ }

      {/* Background decorations - always visible */ }
      { (animationPhase === "celebration" ||
        animationPhase === "text" ||
        animationPhase === "complete") && (
          <>
            <SugarcaneSway duration={ 8 } />
            <RiceGrains grainCount={ 40 } duration={ 10 } />
          </>
        ) }

      {/* Sunrise animation (0-2s) */ }
      { animationPhase === "sunrise" && (
        <SunRise
          duration={ 2 * (animationConfig.duration / 8000) }
          sunColor={ adjustedColors[0] }
          rayColor={ adjustedColors[1] }
          onComplete={ () => {
            // Sunrise complete handled by timeline
          } }
        />
      ) }

      {/* Kolam drawing (2-4s) */ }
      { animationPhase === "kolam" && (
        <KolamDrawing
          duration={ 2 }
          color="#F5F5DC"
          circleCount={ 6 }
          onComplete={ () => {
            // Kolam complete handled by timeline
          } }
        />
      ) }

      {/* Pongal pot with boiling and overflow (3-6s) */ }
      { (animationPhase === "pot" || animationPhase === "celebration") && (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <PongalPot
              duration={ 6 }
              potColor="#D2691E"
              overflowAt={ 4 }
              onComplete={ () => {
                // Pot animation complete
              } }
            />
          </div>

          {/* Steam particles (4-10s) */ }
          <SteamParticles
            particleCount={ animationConfig.particleCount }
            duration={ 6 * (animationConfig.duration / 8000) }
            onComplete={ () => {
              // Steam complete
            } }
          />
        </>
      ) }

      {/* Text content (6-10s) - Always rendered but initially hidden, T151: responsive */ }
      <div
        className={ `relative z-20 max-w-2xl text-center w-full ${isPreview ? "p-4 sm:p-6 space-y-4 sm:space-y-6" : "space-y-6"
          } ${animationPhase !== "text" && animationPhase !== "complete" ? "opacity-0 pointer-events-none" : ""}` }
      >
        <h1
          className={ `greeting-text font-bold drop-shadow-lg ${isPreview
              ? "text-2xl sm:text-3xl md:text-4xl"
              : "text-4xl sm:text-5xl md:text-6xl"
            }` }
          style={ { color: adjustedColors[2] } }
        >
          Pongal Vazhthukkal!
        </h1>

        <div className={ isPreview ? "space-y-3 sm:space-y-4" : "space-y-4" }>
          <p
            className={ `recipient-name font-semibold drop-shadow-md text-white ${isPreview
                ? "text-lg sm:text-2xl md:text-3xl"
                : "text-2xl sm:text-3xl md:text-4xl"
              }` }
          >
            Dear { recipientName },
          </p>

          <p
            className={ `message-body leading-relaxed px-4 drop-shadow-md text-white ${isPreview
                ? "text-sm sm:text-base md:text-lg"
                : "text-base sm:text-lg md:text-xl"
              }` }
          >
            { message ||
              `May this harvest festival bring abundant prosperity and happiness to you and your family!` }
          </p>

          <p
            className={ `sender-name font-medium drop-shadow-md ${isPreview
                ? "text-base sm:text-lg md:text-xl mt-4 sm:mt-6"
                : "text-lg sm:text-xl md:text-2xl mt-8"
              }` }
            style={ { color: adjustedColors[1] } }
          >
            With best wishes,
            <br />
            { senderName }
          </p>
        </div>
      </div>
    </div>
  );
}
