"use client";

/**
 * Greeting Renderer Component
 * Routes to the appropriate template based on festival and template ID
 */

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { FestivalType, RelationshipType } from "@/types";
import { getRelationshipContext } from "@/lib/context-engine";
import { DiwaliTemplate } from "./DiwaliTemplate";
import { HoliTemplate } from "./HoliTemplate";
import { ChristmasTemplate } from "./ChristmasTemplate";
import { NewYearTemplate } from "./NewYearTemplate";
import { PongalTemplate } from "./PongalTemplate";
import { GenericTemplate } from "./GenericTemplate";
import { ReplayButton } from "../shared/ReplayButton";

interface GreetingRendererProps {
  festivalType: FestivalType;
  relationshipType: RelationshipType;
  recipientName: string;
  senderName: string;
  message: string;
  templateId: string;
}

export function GreetingRenderer({
  festivalType,
  relationshipType,
  recipientName,
  senderName,
  message,
  templateId,
}: GreetingRendererProps) {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const relationshipContext = getRelationshipContext(relationshipType);

  const handleReplay = () => {
    setAnimationComplete(false);
    setReplayKey((prev) => prev + 1);
  };

  const handleAnimationComplete = () => {
    setAnimationComplete(true);
  };

  const templateProps = {
    recipientName,
    senderName,
    message,
    relationshipContext,
    onAnimationComplete: handleAnimationComplete,
    key: replayKey,
  };

  // Render the appropriate template based on festival type
  const renderTemplate = () => {
    switch (festivalType) {
      case "diwali":
        return <DiwaliTemplate {...templateProps} />;
      case "holi":
        return <HoliTemplate {...templateProps} />;
      case "christmas":
        return <ChristmasTemplate {...templateProps} />;
      case "newyear":
        return <NewYearTemplate {...templateProps} />;
      case "pongal":
        return <PongalTemplate {...templateProps} />;
      case "generic":
        return <GenericTemplate {...templateProps} />;
      default:
        return <GenericTemplate {...templateProps} />;
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Animated Template */}
      <div className="relative z-10">{renderTemplate()}</div>

      {/* Replay Button */}
      {animationComplete && (
        <div className="fixed bottom-16 right-3 z-20 sm:bottom-20 sm:right-4 md:bottom-24 md:right-8">
          <ReplayButton onClick={handleReplay} />
        </div>
      )}

      {/* Viral Growth CTA */}
      {animationComplete && (
        <div className="fixed bottom-3 left-3 right-3 z-20 flex justify-center sm:bottom-4 sm:left-4 sm:right-4">
          <Button
            asChild
            size="lg"
            className="touch-target-lg w-full max-w-md bg-white text-purple-900 hover:bg-purple-50 active:scale-95 shadow-lg text-sm sm:text-base"
          >
            <Link href="/">Create Your Own Wysh 🎉</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
