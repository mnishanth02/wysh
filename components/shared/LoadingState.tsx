/**
 * Loading State Component: Wysh Festival Greeting Platform
 *
 * Displays loading indicators for async operations
 */

import { cn, generateUniqueKey } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

// ============================================================================
// Loading State Props
// ============================================================================

interface LoadingStateProps {
    /**
     * Loading message to display
     */
    message?: string;

    /**
     * Size of the spinner
     */
    size?: "sm" | "md" | "lg";

    /**
     * Whether to show full screen overlay
     */
    fullScreen?: boolean;

    /**
     * Additional CSS classes
     */
    className?: string;
}

// ============================================================================
// Loading State Component
// ============================================================================

export function LoadingState({
    message = "Loading...",
    size = "md",
    fullScreen = false,
    className,
}: LoadingStateProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
    };

    const content = (
        <div
            className={ cn(
                "flex flex-col items-center justify-center gap-4",
                fullScreen ? "min-h-screen" : "min-h-[200px]",
                className,
            ) }
        >
            <Spinner className={ sizeClasses[size] } />
            { message && (
                <p className="text-sm text-muted-foreground animate-pulse">{ message }</p>
            ) }
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
                { content }
            </div>
        );
    }

    return content;
}

// ============================================================================
// Skeleton Loading Components
// ============================================================================

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return <div className={ cn("animate-pulse rounded-md bg-muted", className) } />;
}

/**
 * Card skeleton for greeting previews
 */
export function CardSkeleton() {
    return (
        <div className="rounded-lg border bg-card p-6 space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-2/3" />
        </div>
    );
}

/**
 * Festival grid skeleton
 */
export function FestivalGridSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            { Array.from({ length: 6 }).map(() => (
                <div
                    key={ generateUniqueKey() }
                    className="rounded-lg border bg-card p-6 space-y-3"
                >
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            )) }
        </div>
    );
}

/**
 * Template grid skeleton
 */
export function TemplateGridSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            { Array.from({ length: 3 }).map(() => (
                <div
                    key={ generateUniqueKey() }
                    className="rounded-lg border bg-card overflow-hidden"
                >
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4 space-y-2">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            )) }
        </div>
    );
}

// ============================================================================
// Inline Loading Indicators
// ============================================================================

interface InlineLoadingProps {
    message?: string;
    size?: "sm" | "md";
    className?: string;
}

export function InlineLoading({
    message,
    size = "sm",
    className,
}: InlineLoadingProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
    };

    return (
        <div className={ cn("flex items-center gap-2", className) }>
            <Spinner className={ sizeClasses[size] } />
            { message && (
                <span className="text-sm text-muted-foreground">{ message }</span>
            ) }
        </div>
    );
}
