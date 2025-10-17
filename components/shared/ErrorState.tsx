/**
 * Error State Component: Wysh Festival Greeting Platform
 *
 * Displays error messages and retry options
 */

import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";

// ============================================================================
// Error State Props
// ============================================================================

interface ErrorStateProps {
  /**
   * Error title
   */
  title?: string;

  /**
   * Error message
   */
  message: string;

  /**
   * Retry button handler
   */
  onRetry?: () => void;

  /**
   * Navigate to home handler
   */
  onGoHome?: () => void;

  /**
   * Error severity
   */
  severity?: "error" | "warning" | "info";

  /**
   * Whether to show full screen error
   */
  fullScreen?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

// ============================================================================
// Error State Component
// ============================================================================

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  onGoHome,
  severity = "error",
  fullScreen = false,
  className,
}: ErrorStateProps) {
  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 p-6",
        fullScreen ? "min-h-screen" : "min-h-[400px]",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <div
          className={cn(
            "p-3 rounded-full",
            severity === "error" && "bg-destructive/10 text-destructive",
            severity === "warning" && "bg-warning/10 text-warning",
            severity === "info" && "bg-info/10 text-info",
          )}
        >
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>

        <div className="flex gap-3 pt-2">
          {onRetry && (
            <Button onClick={onRetry} variant="default">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          {onGoHome && (
            <Button onClick={onGoHome} variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return <div className="fixed inset-0 z-50 bg-background">{content}</div>;
  }

  return content;
}

// ============================================================================
// Inline Error Components
// ============================================================================

interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function InlineError({ message, onRetry, className }: InlineErrorProps) {
  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {onRetry && (
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            className="ml-4"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

// ============================================================================
// Error Boundary Fallback
// ============================================================================

interface ErrorBoundaryFallbackProps {
  error: Error;
  resetError: () => void;
}

export function ErrorBoundaryFallback({
  error,
  resetError,
}: ErrorBoundaryFallbackProps) {
  return (
    <ErrorState
      title="Unexpected Error"
      message={
        error.message ||
        "An unexpected error occurred. Please try refreshing the page."
      }
      onRetry={resetError}
      onGoHome={() => {
        window.location.href = "/";
      }}
      fullScreen
    />
  );
}

// ============================================================================
// Specific Error States
// ============================================================================

/**
 * Greeting not found error
 */
export function GreetingNotFoundError({ onGoHome }: { onGoHome?: () => void }) {
  return (
    <ErrorState
      title="Greeting Not Found"
      message="This greeting link is invalid or has expired. The greeting you're looking for doesn't exist."
      onGoHome={onGoHome}
      severity="warning"
    />
  );
}

/**
 * Network error
 */
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Connection Error"
      message="Unable to connect to the server. Please check your internet connection and try again."
      onRetry={onRetry}
      severity="error"
    />
  );
}

/**
 * Creation failed error
 */
export function CreationFailedError({ onRetry }: { onRetry?: () => void }) {
  return (
    <InlineError
      message="Failed to create greeting. Please try again."
      onRetry={onRetry}
    />
  );
}

/**
 * Generic API error
 */
export function ApiError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <InlineError
      message={message || "An error occurred while processing your request."}
      onRetry={onRetry}
    />
  );
}
