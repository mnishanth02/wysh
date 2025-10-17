"use client";

/**
 * Replay Button Component
 * Allows users to replay the greeting animation
 */

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReplayButtonProps {
  onClick: () => void;
}

export function ReplayButton({ onClick }: ReplayButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="touch-target-lg rounded-full bg-white text-purple-900 hover:bg-purple-50 active:scale-90 shadow-lg h-12 w-12 sm:h-14 sm:w-14 p-0"
      aria-label="Replay animation"
    >
      <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6" />
    </Button>
  );
}
