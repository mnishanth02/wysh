"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { getCounterAnimationConfig } from "@/lib/animations";

interface UseCounterAnimationOptions {
  /**
   * Target number to count to
   */
  end: number;
  /**
   * Starting number (default: 0)
   */
  start?: number;
  /**
   * Animation duration in seconds (default: 2, or 0.5 if reduced motion)
   */
  duration?: number;
  /**
   * If true, animation starts immediately on mount
   */
  autoPlay?: boolean;
  /**
   * Callback when animation completes
   */
  onComplete?: () => void;
}

/**
 * Hook to animate a number counter with GSAP
 *
 * @example
 * ```tsx
 * const { value, play } = useCounterAnimation({
 *   end: 1000,
 *   autoPlay: false,
 * });
 *
 * const { ref, isIntersecting } = useIntersectionObserver({ triggerOnce: true });
 *
 * useEffect(() => {
 *   if (isIntersecting) play();
 * }, [isIntersecting, play]);
 *
 * return <div ref={ref}>{value.toLocaleString()}</div>;
 * ```
 */
export function useCounterAnimation({
  end,
  start = 0,
  duration,
  autoPlay = true,
  onComplete,
}: UseCounterAnimationOptions) {
  const [value, setValue] = useState(start);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const hasPlayedRef = useRef(false);

  const config = getCounterAnimationConfig();
  const animDuration = duration ?? config.duration;

  const play = () => {
    if (hasPlayedRef.current) return;
    hasPlayedRef.current = true;

    const counterObject = { value: start };

    tweenRef.current = gsap.to(counterObject, {
      value: end,
      duration: animDuration,
      ease: config.ease,
      onUpdate: () => {
        setValue(Math.round(counterObject.value));
      },
      onComplete: () => {
        setValue(end);
        onComplete?.();
      },
    });
  };

  const reset = () => {
    hasPlayedRef.current = false;
    setValue(start);
    tweenRef.current?.kill();
    tweenRef.current = null;
  };

  const pause = () => {
    tweenRef.current?.pause();
  };

  const resume = () => {
    tweenRef.current?.resume();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <false positive>
  useEffect(() => {
    if (autoPlay) {
      play();
    }

    return () => {
      tweenRef.current?.kill();
    };
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    value,
    play,
    reset,
    pause,
    resume,
    isPlaying: tweenRef.current?.isActive() ?? false,
  };
}
