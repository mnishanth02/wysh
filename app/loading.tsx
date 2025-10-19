import { LoadingState } from "@/components/shared/LoadingState";

/**
 * Root loading state
 * Displayed while homepage is loading
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingState message="Loading Wysh..." size="lg" />
    </div>
  );
}
