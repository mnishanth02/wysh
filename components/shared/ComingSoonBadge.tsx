/**
 * Coming Soon Badge Component
 *
 * Visual indicator for disabled festival features
 * Used in festival selector cards to show unavailable festivals
 */

import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ComingSoonBadgeProps {
    /**
     * Position of the badge on the card
     * @default "top-right"
     */
    position?: "top-right" | "bottom-center" | "overlay";

    /**
     * Size variant
     * @default "default"
     */
    size?: "sm" | "default" | "lg";

    /**
     * Optional custom className
     */
    className?: string;
}

/**
 * Badge component to indicate feature is coming soon
 *
 * @example
 * // Top-right corner badge
 * <ComingSoonBadge position="top-right" />
 *
 * @example
 * // Overlay badge (center of card)
 * <ComingSoonBadge position="overlay" size="lg" />
 */
export function ComingSoonBadge({
    position = "top-right",
    size = "default",
    className = "",
}: ComingSoonBadgeProps) {
    const positionClasses = {
        "top-right": "absolute top-3 right-3 z-10",
        "bottom-center": "absolute bottom-3 left-1/2 -translate-x-1/2 z-10",
        overlay: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
    };

    const sizeClasses = {
        sm: "text-xs px-2 py-1 gap-1",
        default: "text-sm px-3 py-1.5 gap-1.5",
        lg: "text-base px-4 py-2 gap-2",
    };

    const iconSizes = {
        sm: "h-3 w-3",
        default: "h-3.5 w-3.5",
        lg: "h-4 w-4",
    };

    return (
        <Badge
            variant="secondary"
            className={ `
        ${positionClasses[position]}
        ${sizeClasses[size]}
        bg-gradient-to-r from-amber-500/90 to-orange-500/90
        text-white
        font-semibold
        shadow-lg
        backdrop-blur-sm
        border-0
        flex items-center
        pointer-events-none
        ${className}
      `}
        >
            <Lock className={ iconSizes[size] } />
            <span>Coming Soon</span>
        </Badge>
    );
}

/**
 * Overlay component to disable interaction with coming soon features
 * Places a semi-transparent overlay over the entire card
 *
 * @example
 * <div className="relative">
 *   <FestivalCard {...props} />
 *   <ComingSoonOverlay />
 * </div>
 */
export function ComingSoonOverlay({ className = "" }: { className?: string }) {
    return (
        <div
            className={ `
        absolute inset-0
        bg-background/60
        backdrop-blur-[2px]
        cursor-not-allowed
        z-[5]
        rounded-lg
        ${className}
      `}
            aria-hidden="true"
        />
    );
}
