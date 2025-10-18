/**
 * Lazy Loading Configuration for Animation Components
 *
 * Implements dynamic imports for heavy animation components to reduce initial bundle size.
 * Tasks: T120 - Implement lazy loading for animation assets
 */

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * Loading component for lazy-loaded animations
 */
const AnimationLoading = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
      <p className="text-sm text-muted-foreground">Loading animation...</p>
    </div>
  </div>
);

/**
 * Lazy-loaded Diwali Template
 *
 * Reduces initial bundle by ~50KB (animations + GSAP plugins)
 */
export const LazyDiwaliTemplate = dynamic(
  () =>
    import("@/components/greetings/DiwaliTemplate").then((mod) => ({
      default: mod.DiwaliTemplate,
    })),
  {
    loading: AnimationLoading,
    ssr: false, // Animations don't work server-side
  },
);

/**
 * Lazy-loaded New Year Template
 *
 * Reduces initial bundle by ~45KB (countdown + confetti systems)
 */
export const LazyNewYearTemplate = dynamic(
  () =>
    import("@/components/greetings/NewYearTemplate").then((mod) => ({
      default: mod.NewYearTemplate,
    })),
  {
    loading: AnimationLoading,
    ssr: false,
  },
);

/**
 * Lazy-loaded Pongal Template
 *
 * Reduces initial bundle by ~40KB (harvest animations + SVGs)
 */
export const LazyPongalTemplate = dynamic(
  () =>
    import("@/components/greetings/PongalTemplate").then((mod) => ({
      default: mod.PongalTemplate,
    })),
  {
    loading: AnimationLoading,
    ssr: false,
  },
);

/**
 * Lazy-loaded Christmas Template
 */
export const LazyChristmasTemplate = dynamic(
  () =>
    import("@/components/greetings/ChristmasTemplate").then((mod) => ({
      default: mod.ChristmasTemplate,
    })),
  {
    loading: AnimationLoading,
    ssr: false,
  },
);

/**
 * Lazy-loaded Holi Template
 */
export const LazyHoliTemplate = dynamic(
  () =>
    import("@/components/greetings/HoliTemplate").then((mod) => ({
      default: mod.HoliTemplate,
    })),
  {
    loading: AnimationLoading,
    ssr: false,
  },
);

/**
 * Lazy-loaded Generic Template
 */
export const LazyGenericTemplate = dynamic(
  () =>
    import("@/components/greetings/GenericTemplate").then((mod) => ({
      default: mod.GenericTemplate,
    })),
  {
    loading: AnimationLoading,
    ssr: false,
  },
);

/**
 * Preload animation component
 * Call this when user hovers over template card to reduce perceived loading time
 *
 * @example
 * ```tsx
 * <div onMouseEnter={() => preloadTemplate('diwali')}>
 *   Diwali Template
 * </div>
 * ```
 */
export function preloadTemplate(
  festival: "diwali" | "newyear" | "pongal" | "christmas" | "holi" | "generic",
): void {
  switch (festival) {
    case "diwali":
      (LazyDiwaliTemplate as { preload?: () => void }).preload?.();
      break;
    case "newyear":
      (LazyNewYearTemplate as { preload?: () => void }).preload?.();
      break;
    case "pongal":
      (LazyPongalTemplate as { preload?: () => void }).preload?.();
      break;
    case "christmas":
      (LazyChristmasTemplate as { preload?: () => void }).preload?.();
      break;
    case "holi":
      (LazyHoliTemplate as { preload?: () => void }).preload?.();
      break;
    case "generic":
      (LazyGenericTemplate as { preload?: () => void }).preload?.();
      break;
  }
}

/**
 * Preload all animation templates
 * Useful for idle time preloading
 */
export function preloadAllTemplates(): void {
  if (typeof window === "undefined") return;

  // Use requestIdleCallback if available, otherwise setTimeout
  const schedulePreload = (callback: () => void) => {
    if ("requestIdleCallback" in window) {
      (
        window as Window & {
          requestIdleCallback: (callback: () => void) => void;
        }
      ).requestIdleCallback(callback);
    } else {
      setTimeout(callback, 1);
    }
  };

  schedulePreload(() =>
    (LazyDiwaliTemplate as { preload?: () => void }).preload?.(),
  );
  schedulePreload(() =>
    (LazyNewYearTemplate as { preload?: () => void }).preload?.(),
  );
  schedulePreload(() =>
    (LazyPongalTemplate as { preload?: () => void }).preload?.(),
  );
  schedulePreload(() =>
    (LazyChristmasTemplate as { preload?: () => void }).preload?.(),
  );
  schedulePreload(() =>
    (LazyHoliTemplate as { preload?: () => void }).preload?.(),
  );
  schedulePreload(() =>
    (LazyGenericTemplate as { preload?: () => void }).preload?.(),
  );
}

/**
 * Get lazy template component by festival type
 */
export function getLazyTemplate(
  festival: "diwali" | "newyear" | "pongal" | "christmas" | "holi" | "generic",
): ComponentType<unknown> {
  switch (festival) {
    case "diwali":
      return LazyDiwaliTemplate as ComponentType<unknown>;
    case "newyear":
      return LazyNewYearTemplate as ComponentType<unknown>;
    case "pongal":
      return LazyPongalTemplate as ComponentType<unknown>;
    case "christmas":
      return LazyChristmasTemplate as ComponentType<unknown>;
    case "holi":
      return LazyHoliTemplate as ComponentType<unknown>;
    case "generic":
      return LazyGenericTemplate as ComponentType<unknown>;
    default:
      return LazyGenericTemplate as ComponentType<unknown>;
  }
}
