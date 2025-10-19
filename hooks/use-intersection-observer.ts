"use client";

import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /**
   * If true, observer disconnects after first intersection
   */
  triggerOnce?: boolean;
  /**
   * If true, callback fires immediately if element is already in viewport on mount
   */
  fireOnMount?: boolean;
}

/**
 * Hook to observe when an element enters the viewport
 *
 * @param options - IntersectionObserver options + custom options
 * @returns Ref to attach to target element and isIntersecting state
 *
 * @example
 * ```tsx
 * const { ref, isIntersecting } = useIntersectionObserver({
 *   threshold: 0.5,
 *   triggerOnce: true,
 * });
 *
 * return (
 *   <div ref={ref}>
 *     {isIntersecting && <AnimatedComponent />}
 *   </div>
 * );
 * ```
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {},
) {
  const {
    threshold = 0,
    root = null,
    rootMargin = "0px",
    triggerOnce = false,
    fireOnMount = false,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<T>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    // Check if fireOnMount is enabled and element is already in viewport
    if (fireOnMount && !hasIntersected) {
      const rect = target.getBoundingClientRect();
      const isVisible =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth);

      if (isVisible) {
        setIsIntersecting(true);
        setHasIntersected(true);
        if (triggerOnce) return;
      }
    }

    // If already intersected and triggerOnce is true, don't observe
    if (hasIntersected && triggerOnce) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;

        setIsIntersecting(isElementIntersecting);

        if (isElementIntersecting) {
          setHasIntersected(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        }
      },
      { threshold, root, rootMargin },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, triggerOnce, fireOnMount, hasIntersected]);

  return {
    ref: targetRef,
    isIntersecting,
    hasIntersected,
  };
}
