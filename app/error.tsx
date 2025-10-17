"use client";

/**
 * Global Error Boundary
 * Catches React errors and displays user-friendly error UI
 */

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50">
          <Card className="w-full max-w-md p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-red-100 p-4">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong!
            </h1>

            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Don't worry, your data is
              safe.
            </p>

            {error.digest && (
              <p className="text-xs text-gray-400 mb-6 font-mono">
                Error ID: {error.digest}
              </p>
            )}

            <div className="flex flex-col gap-3">
              <Button onClick={reset} className="w-full" size="lg">
                Try Again
              </Button>

              <Button
                onClick={() => {
                  window.location.href = "/";
                }}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Return to Home
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              If this problem persists, please try refreshing the page or come
              back later.
            </p>
          </Card>
        </div>
      </body>
    </html>
  );
}
