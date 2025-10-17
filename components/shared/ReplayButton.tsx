"use client";

/**
 * Replay Button Component
 * Allows users to replay the greeting animation
 */

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface ReplayButtonProps {
  onClick: () => void;
}

export function ReplayButton({ onClick }: ReplayButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="rounded-full bg-white text-purple-900 hover:bg-purple-50 shadow-lg h-14 w-14 p-0"
      aria-label="Replay animation"
    >
      <RotateCcw className="h-6 w-6" />
    </Button>
  );
}
