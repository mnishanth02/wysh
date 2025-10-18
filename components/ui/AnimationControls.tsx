"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/**
 * Animation control state interface
 */
export interface AnimationState {
  isPlaying: boolean;
  isPaused: boolean;
  isComplete: boolean;
  currentTime: number;
  totalDuration: number;
  progress: number; // 0-100
}

/**
 * Props for AnimationControls component
 */
export interface AnimationControlsProps {
  /** Current animation state */
  state: AnimationState;
  /** Play animation handler */
  onPlay: () => void;
  /** Pause animation handler */
  onPause: () => void;
  /** Replay animation handler */
  onReplay: () => void;
  /** Seek to specific time (optional) */
  onSeek?: (time: number) => void;
  /** Show progress bar */
  showProgress?: boolean;
  /** Show time display */
  showTime?: boolean;
  /** Enable keyboard shortcuts */
  enableKeyboard?: boolean;
  /** Custom className */
  className?: string;
  /** Compact mode */
  compact?: boolean;
}

/**
 * AnimationControls Component
 *
 * Provides play/pause/replay controls for greeting animations with keyboard support.
 *
 * Features:
 * - Play/pause/replay buttons with loading states
 * - Progress bar (0-100%) with current time display
 * - Keyboard shortcuts: Space = play/pause, R = replay, Left/Right = seek ±1s
 * - Accessible with ARIA labels
 * - Compact mode for mobile
 *
 * @example
 * ```tsx
 * const [animState, setAnimState] = useState<AnimationState>({
 *   isPlaying: false,
 *   isPaused: false,
 *   isComplete: false,
 *   currentTime: 0,
 *   totalDuration: 10000,
 *   progress: 0
 * });
 *
 * <AnimationControls
 *   state={animState}
 *   onPlay={() => timeline.play()}
 *   onPause={() => timeline.pause()}
 *   onReplay={() => timeline.restart()}
 *   enableKeyboard
 * />
 * ```
 */
export function AnimationControls({
  state,
  onPlay,
  onPause,
  onReplay,
  onSeek,
  showProgress = true,
  showTime = true,
  enableKeyboard = true,
  className,
  compact = false,
}: AnimationControlsProps) {
  const controlsRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  /**
   * Format time in MM:SS format
   */
  const formatTime = useCallback((milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enableKeyboard || !isFocused) return;

      switch (event.key) {
        case " ": // Space = play/pause
          event.preventDefault();
          if (state.isPlaying) {
            onPause();
          } else {
            onPlay();
          }
          break;
        case "r":
        case "R": // R = replay
          event.preventDefault();
          onReplay();
          break;
        case "ArrowLeft": // Left arrow = seek -1s
          event.preventDefault();
          if (onSeek && state.currentTime > 0) {
            onSeek(Math.max(0, state.currentTime - 1000));
          }
          break;
        case "ArrowRight": // Right arrow = seek +1s
          event.preventDefault();
          if (onSeek && state.currentTime < state.totalDuration) {
            onSeek(Math.min(state.totalDuration, state.currentTime + 1000));
          }
          break;
      }
    },
    [
      enableKeyboard,
      isFocused,
      state.isPlaying,
      state.currentTime,
      state.totalDuration,
      onPlay,
      onPause,
      onReplay,
      onSeek,
    ],
  );

  /**
   * Setup keyboard event listeners
   */
  useEffect(() => {
    if (!enableKeyboard) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableKeyboard, handleKeyDown]);

  /**
   * Handle focus management
   */
  useEffect(() => {
    const element = controlsRef.current;
    if (!element) return;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    element.addEventListener("focusin", handleFocus);
    element.addEventListener("focusout", handleBlur);

    return () => {
      element.removeEventListener("focusin", handleFocus);
      element.removeEventListener("focusout", handleBlur);
    };
  }, []);

  return (
    <section
      ref={controlsRef}
      className={cn(
        "flex flex-col gap-3 rounded-lg bg-background/80 backdrop-blur-sm p-4",
        compact && "gap-2 p-3",
        className,
      )}
      aria-label="Animation controls"
    >
      {/* Progress Bar */}
      {showProgress && (
        <div className="flex items-center gap-3">
          <Progress
            value={state.progress}
            className="h-2 flex-1"
            aria-label={`Animation progress: ${Math.round(state.progress)}%`}
          />
          {showTime && (
            <span
              className={cn(
                "text-sm text-muted-foreground tabular-nums min-w-[48px]",
                compact && "text-xs",
              )}
              aria-live="polite"
            >
              {formatTime(state.currentTime)}
            </span>
          )}
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-2">
        {/* Play/Pause Button */}
        {!state.isComplete && (
          <Button
            size={compact ? "sm" : "default"}
            variant="outline"
            onClick={state.isPlaying ? onPause : onPlay}
            disabled={state.isComplete}
            aria-label={state.isPlaying ? "Pause animation" : "Play animation"}
            className="gap-2"
          >
            {state.isPlaying ? (
              <>
                <Pause className="h-4 w-4" />
                {!compact && <span>Pause</span>}
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                {!compact && <span>Play</span>}
              </>
            )}
          </Button>
        )}

        {/* Replay Button */}
        {(state.isComplete || state.isPaused) && (
          <Button
            size={compact ? "sm" : "default"}
            variant={state.isComplete ? "default" : "outline"}
            onClick={onReplay}
            aria-label="Replay animation"
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            {!compact && <span>Replay</span>}
          </Button>
        )}
      </div>

      {/* Keyboard Hints (Desktop Only) */}
      {enableKeyboard && !compact && (
        <div className="hidden sm:flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-muted">Space</kbd>{" "}
            Play/Pause
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-muted">R</kbd> Replay
          </span>
          {onSeek && (
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-muted">←/→</kbd> Seek
            </span>
          )}
        </div>
      )}
    </section>
  );
}

/**
 * Hook to manage animation state
 *
 * @example
 * ```tsx
 * const animControls = useAnimationControls(timeline);
 * <AnimationControls state={animControls.state} {...animControls.handlers} />
 * ```
 */
export function useAnimationControls(timeline: gsap.core.Timeline | null) {
  const [state, setState] = useState<AnimationState>({
    isPlaying: false,
    isPaused: false,
    isComplete: false,
    currentTime: 0,
    totalDuration: 0,
    progress: 0,
  });

  // Update state based on timeline
  useEffect(() => {
    if (!timeline) return;

    const updateState = () => {
      const currentTime = timeline.time() * 1000;
      const totalDuration = timeline.duration() * 1000;
      const progress =
        totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

      setState({
        isPlaying: timeline.isActive(),
        isPaused: timeline.paused(),
        isComplete: progress >= 100,
        currentTime,
        totalDuration,
        progress: Math.min(100, progress),
      });
    };

    const interval = setInterval(updateState, 100); // Update every 100ms
    updateState(); // Initial update

    return () => clearInterval(interval);
  }, [timeline]);

  const handlers = {
    onPlay: useCallback(() => timeline?.play(), [timeline]),
    onPause: useCallback(() => timeline?.pause(), [timeline]),
    onReplay: useCallback(() => timeline?.restart(), [timeline]),
    onSeek: useCallback(
      (time: number) => timeline?.seek(time / 1000),
      [timeline],
    ),
  };

  return { state, handlers };
}
