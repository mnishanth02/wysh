import { LoadingState } from "@/components/shared/LoadingState";

/**
 * Create flow loading state
 * Displayed while any create page is loading
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingState message="Preparing greeting creator..." size="lg" />
    </div>
  );
}
